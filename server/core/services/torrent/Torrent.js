const WebTorrent = require('webtorrent');
const prettySize = require('prettysize');
const uuid = require('uuid');
const path = require('path');
const Connection = require('../connection/Connection');
const Drive = require('../../services/drives/Drive');
const Uploads = require('../upload/Uploads');
const TorrentToDriveProcess = require('../upload/TorrentToDriveProcess');
const strings = require('../../Strings');
const AdvanceUpload = require('../../services/upload/AdvanceUpload');
const UploadModel = require('../../model/Upload');

class Torrent {
  constructor() {
    this.connection = new Connection();
  }
  explore(torrentId) {
    return new Promise((resolve, reject) => {
      const client = new WebTorrent();
      client.add(torrentId, (torrent) => {
        if (!torrent) {
          return reject(new Error('Unable to extract torrent.'));
        }
        const files = torrent.files.map((item) => ({
          size: item.length,
          path: item.path,
          id: item.path,
          format: 'file',
          type: path.extname(item.name),
          name: item.name,
        }));
        return resolve(files);
      });
    });
  }
  getConnection(connectionId) {
    return this.connection.findOne({ _id: connectionId });
  }
  /**
   * Copy a torrent item to cloud storage
   * @param {Object} source   (Torrent item to be copied)
   * @param {Object} destination  (Cloud storage where torrent item will be copied)
   */
  async copyToCloud(user, { source, destination }) {
    const destinationConnection = await this.getConnection(destination.connectionId);
    if (!destinationConnection) {
      return Promise.reject(new Error('Connection not found.'));
    }
    const destinationDrive = new Drive(destinationConnection.service_type);
    destinationDrive.setAccessToken(global.helper.decrypt(destinationConnection.accessToken));

    const maxAllowedBytes = user.plan.features.bytes_quota;
    const bytesUsed = await new Uploads().getBytesUsedInMonth(user._id);
    if (source.size > maxAllowedBytes || bytesUsed + source.size > maxAllowedBytes) {
      return Promise.reject(new Error(`You have only ${prettySize(maxAllowedBytes - bytesUsed)} left`));
    }
    const ttdProcess = new TorrentToDriveProcess(source, destination);
    const groupId = uuid();
    ttdProcess.setAuthProfile({ ...destinationConnection.profile, accessToken: null });
    ttdProcess.setDestinationMeta({
      data: destination,
      service: destinationConnection.service_type,
      accessToken: destinationConnection.accessToken,
    });
    ttdProcess.setSourceMeta({
      data: source,
    });
    ttdProcess.headers = {};
    ttdProcess.meta = {
      started_at: Date.now(),
      name: source.name,
      size: source.size,
      ...source.torrent,
    };
    ttdProcess.setService(destinationConnection.service_type);
    ttdProcess.setUser(user);
    ttdProcess.regenerateMetaUuid(destinationConnection.service_type);
    ttdProcess.setGroupId(groupId);
    await UploadModel.create({
      user_id: user._id,
      url: null,
      uuid: ttdProcess.meta.uuid,
      meta: ttdProcess.meta,
      bytes_used: source.size,
      email: destinationConnection.profile.email,
      service: destinationConnection.service_type,
      type: strings.PROCESS_TYPE.TORRENT_TO_DRIVE,
    });
    await new AdvanceUpload().setGroupId(groupId).createUploadQueue({
      userId: user._id,
      uploadProcesses: ttdProcess,
    });
    global.events.emit(strings.UPLOAD_NEW_FILE, {
      uploadProcess: ttdProcess,
    });
    return ttdProcess;
  }
}
module.exports = Torrent;
