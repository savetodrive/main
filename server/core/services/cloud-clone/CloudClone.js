const uuid = require('uuid');
const prettySize = require('prettysize');
const Connection = require('../connection/Connection');
const Drive = require('../../services/drives/Drive');
const Uploads = require('../upload/Uploads');
const CloudCloneProcess = require('../upload/CloudCloneProcess');
const strings = require('../../Strings');
const AdvanceUpload = require('../../services/upload/AdvanceUpload');
const UploadModel = require('../../model/Upload');

class CloudClone {
  constructor(connectionId) {
    this.connectionId = connectionId;
    this.connection = new Connection();
  }

  getConnection(connectionId) {
    return this.connection.findOne({ _id: connectionId });
  }

  async copy(user, { source, destination }) {
    const sourceConnection = await this.getConnection(source.connectionId);
    const destinationConnection = await this.getConnection(destination.connectionId);
    if (!sourceConnection || !destinationConnection) {
      return Promise.reject(new Error('Connection not found.'));
    }
    const sourceDrive = new Drive(sourceConnection.service_type);
    sourceDrive.setAccessToken(global.helper.decrypt(sourceConnection.accessToken));

    const destinationDrive = new Drive(destinationConnection.service_type);
    destinationDrive.setAccessToken(global.helper.decrypt(destinationConnection.accessToken));

    const maxAllowedBytes = user.plan.features.bytes_quota;
    const sourceFileInfo = await sourceDrive.fileInfo(source.item.id);
    const bytesUsed = await new Uploads().getBytesUsedInMonth(user._id);

    sourceFileInfo.size = parseFloat(sourceFileInfo.size || 0);
    // if user's volume has finished or if added with new
    if (sourceFileInfo.size > maxAllowedBytes || bytesUsed + sourceFileInfo.size > maxAllowedBytes) {
      return Promise.reject(new Error(`You have only ${prettySize(maxAllowedBytes - bytesUsed)} left`));
    }
    const cloudCloneProcess = new CloudCloneProcess(source, destination);
    const groupId = uuid();
    cloudCloneProcess.setAuthProfile({ ...destinationConnection.profile, accessToken: null });
    cloudCloneProcess.setSourceMeta({
      data: source,
      service: sourceConnection.service_type,
      accessToken: sourceConnection.accessToken,
    });
    cloudCloneProcess.setDestinationMeta({
      data: destination,
      service: destinationConnection.service_type,
      accessToken: destinationConnection.accessToken,
    });
    cloudCloneProcess.headers = {};
    cloudCloneProcess.meta = {
      started_at: Date.now(),
      ...sourceFileInfo,
    };
    cloudCloneProcess.setUser(user);
    cloudCloneProcess.regenerateMetaUuid(destinationConnection.service_type);
    cloudCloneProcess.setGroupId(groupId);

    await UploadModel.create({
      user_id: user._id,
      url: null,
      uuid: cloudCloneProcess.meta.uuid,
      meta: cloudCloneProcess.meta,
      bytes_used: sourceFileInfo.size,
      email: destinationConnection.profile.email,
      service: destinationConnection.service_type,
      type: strings.PROCESS_TYPE.CLOUD_CLONE,
    });
    await new AdvanceUpload().setGroupId(groupId).createUploadQueue({
      userId: user._id,
      uploadProcesses: cloudCloneProcess,
    });
    global.events.emit(strings.UPLOAD_NEW_FILE, {
      uploadProcess: cloudCloneProcess,
    });
    return cloudCloneProcess;
  }
}

module.exports = CloudClone;
