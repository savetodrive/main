const mongoose = require('mongoose');
const BPromise = require('bluebird');
const autobind = require('auto-bind');
const uuid = require('uuid');
const PremiumUploadQueue = require('../../model/PremiumUploadQueue');
const Connection = require('../connection/Connection');
const prettySize = require('prettysize');
const UploadProcess = require('./UploadProcess');
const strings = require('../../Strings');
const Uploads = require('./Uploads');

class AdvanceUpload {
  constructor(payload) {
    autobind(this);
    this.payload = payload;
    this.bytesUsed = 0;
    this.possibleBytesUse = 0;
    this.groupId = uuid();
  }

  getPossibleBytesUse() {
    return this.possibleBytesUse;
  }
  getBytesUsed() {
    return this.bytesUsed;
  }
  getGroupId() {
    return this.groupId;
  }
  setGroupId(groupId) {
    this.groupId = groupId;
    return this;
  }
  async create(user) {
    const { payload } = this;
    const { _ } = global;
    const urls = _.uniqBy(payload.urls, 'value');
    const connectionIds = _.uniqBy(payload.connections);
    const connection = new Connection();
    const groupId = this.getGroupId();
    try {
      const connections = await connection.find({ _id: { $in: connectionIds.map((id) => mongoose.Types.ObjectId(id)) } });
      this.bytesUsed = await new Uploads().getBytesUsedInMonth(user._id);
      this.possibleBytesUse = this.bytesUsed;
      const maxAllowedMB = user.plan.features.bytes_quota;
      // very first plain check if bytes has exceeded
      if (this.bytesUsed >= maxAllowedMB) {
        return Promise.reject(new Error(`Your data of ${prettySize(maxAllowedMB)} has finished`));
      }
      const metas = await BPromise.map(urls, (url) =>
        new UploadProcess(url.value)
          .getUploadMeta({ isHeader: true })
          .then(({ meta, headers }) => ({
            url: url.value,
            meta,
            headers,
          }))
          .catch(() => null),
      ).filter(Boolean);
      const uploadProcesses = [];
      metas.forEach((meta) => {
        connections.forEach((con) => {
          this.possibleBytesUse += parseFloat(meta.meta.size || 0, 10);
          const uploadProcess = new UploadProcess(meta.url, con.service_type, con.accessToken);
          uploadProcess.setGroupId(groupId);
          uploadProcess.setAuthProfile({ ...con.profile, accessToken: null });
          if (payload.isEmail) {
            uploadProcess.setEmail(payload.email);
          }

          if (payload.isFilename) {
            uploadProcess.setFilename(payload.filename);
          }
          uploadProcess.headers = { ...meta.headers };
          uploadProcess.meta = { ...meta.meta };
          uploadProcess.setUser(user);
          uploadProcess.regenerateMetaUuid(con.service_type);
          uploadProcesses.push(uploadProcess);
        });
      });

      return uploadProcesses;
    } catch (error) {
      return error;
    }
  }

  createUploadQueue({ userId, uploadProcesses }) {
    PremiumUploadQueue.create({
      group_id: this.groupId,
      user_id: mongoose.Types.ObjectId(userId),
      uploads: JSON.parse(JSON.stringify(uploadProcesses)),
    });
  }
  /**
   * This uploads are done serially
   * Here we fetch queue by groupId and userId, filter by current uploaded task,
   * filter it
   * @param {Object} previousUpload
   */
  static async continueUpload(previousUpload) {
    const { meta, user, groupId } = previousUpload.uploadProcess;
    const queueClause = { user_id: mongoose.Types.ObjectId(user._id), group_id: groupId };
    try {
      let queue = await PremiumUploadQueue.findOne(queueClause);
      if (!queue) {
        return { status: null };
      }

      const remainingUploads = queue.uploads.filter((upload) => meta.uuid !== upload.meta.uuid);
      if (!remainingUploads.length) {
        // No More further uploads so delete current queue
        await PremiumUploadQueue.remove(queueClause);
        return { status: false };
      }
      let bytesUsed = await new Uploads().getBytesUsedInMonth(user._id);
      const maxAllowedMB = user.plan.features.bytes_quota;
      queue = queue.toObject();
      bytesUsed += parseFloat(remainingUploads[0].meta.size || 0);
      if (bytesUsed >= maxAllowedMB) {
        await PremiumUploadQueue.remove(queueClause);
        return {
          status: false,
          message: `Your data of ${prettySize(maxAllowedMB)} has finished`,
          queue: remainingUploads,
        };
      }
      const update = await PremiumUploadQueue.update(queueClause, { uploads: remainingUploads });
      if (update) {
        AdvanceUpload.dispatchUpload(remainingUploads[0]);
        return { status: true };
      }
      return { status: false };
    } catch (error) {
      global.logger.error(error);
      return error;
    }
  }
  static dispatchUpload(uploadProcess) {
    global.events.emit(strings.UPLOAD_NEW_FILE, {
      uploadProcess,
    });
  }
}
module.exports = AdvanceUpload;
