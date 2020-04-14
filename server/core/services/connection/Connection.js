const ConnectionModel = require('../../model/Connection');
const Drive = require('../../services/drives/Drive');

class Connection {
  /**
   * Type is service name like google drive, box
   * @param {String} type
   */
  constructor(type, { user_id, accessToken, refreshToken } = {}) {
    this.type = type;
    this.user_id = user_id;
    this.accessToken = accessToken;
    this.uniqueId = this.type;
    this.refreshToken = refreshToken;
    this.profile = {};
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }
  setConnectionId(connectionId) {
    this.connectionId = connectionId;
    return this;
  }
  create() {
    const data = {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      profile: this.profile,
      service_type: this.type,
      user_id: this.user_id,
      unique_id: this.uniqueId,
      updated_at: Date.now(),
      expires_at: this.expires_at,
    };
    return ConnectionModel.update(
      {
        service_type: this.type,
        unique_id: this.uniqueId,
      },
      data,
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  setProfile(profile) {
    this.profile = profile;
  }
  setUniqueId(uniqueId) {
    this.uniqueId = uniqueId;
  }
  getUniqueId() {
    return this.uniqueId;
  }
  getAll(userId) {
    return ConnectionModel.find({
      user_id: userId,
    });
  }

  find(...clause) {
    return ConnectionModel.find(...clause);
  }

  findOne(...clause) {
    return ConnectionModel.findOne(...clause);
  }
  remove(clause) {
    return ConnectionModel.find(clause).remove();
  }
  setExpiry(expires_at) {
    this.expires_at = expires_at;
  }
  getConnection(connectionId) {
    return this.findOne({ _id: connectionId });
  }
  async listDirectory(folderId) {
    const connection = await this.getConnection(this.connectionId);
    if (!connection) {
      return Promise.reject(new Error("Connection doesn't exist."));
    }
    const drive = new Drive(connection.service_type);
    drive.setAccessToken(global.helper.decrypt(connection.accessToken));
    return drive.list(folderId);
  }

  async file(fileId) {
    const connection = await this.getConnection(this.connectionId);
    if (!connection) {
      return Promise.reject(new Error("Connection doesn't exist."));
    }
    const drive = new Drive(connection.service_type);
    drive.setAccessToken(global.helper.decrypt(connection.accessToken));
    return drive.fileInfo(fileId);
  }
}

module.exports = Connection;
