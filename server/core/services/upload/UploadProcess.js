const Promise = require('bluebird');
const path = require('path');
const uuidv1 = require('uuid/v1');
const uuidv3 = require('uuid/v3');
const mime = require('mime');
const HttpUrlConnection = require('../HttpUrlConnection');
const Process = require('./Process');

class UploadProcess extends Process {
  constructor(url, cloud, accessToken) {
    super();
    this.url = url;
    this.headers = null;
    this.meta = null;
    this.cloud = cloud;
    this.accessToken = accessToken;
    this.sessionId = null;
    this.isPremium = false;
    this.isCompleted = false;
    this.groupId = null;
  }

  setClients(clients) {
    this.clients = clients;
  }

  async getHead() {
    await new HttpUrlConnection(this.url).getHead();
  }

  createFilename() {
    if (this.filename) {
      return `${this.filename}.${mime.extension(this.headers['content-type'] || 'text/plain')}`;
    }

    return decodeURIComponent(path.basename(this.url));
  }

  async getUploadMeta({ isHeader = false } = {}) {
    if (this.meta) {
      return new Promise((resolve) => resolve(this.meta));
    }

    return new Promise(async (resolve, reject) => {
      try {
        const http = await new HttpUrlConnection(this.url).getHead();
        this.headers = http.headers;
        const name = this.createFilename();
        this.meta = {
          name,
          uuid: uuidv3(name, uuidv1()),
          size: this.headers['content-length'] || 0,
          type: mime.extension(this.headers['content-type'] || 'text/plain'),
          started_at: Date.now(),
        };
        if (isHeader) {
          return resolve({ meta: this.meta, headers: this.headers });
        }
        return resolve(this.meta, http.headers);
      } catch (error) {
        return reject(error);
      }
    });
  }

  setSockets(sockets) {
    this.sockets = sockets;
  }

  emit(type, data) {
    this.sockets.forEach((socket) => {
      socket.emit(type, data);
    });
  }
}

module.exports = UploadProcess;
