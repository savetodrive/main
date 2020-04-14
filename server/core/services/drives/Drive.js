const GoogleDrive = require('./platforms/GoogleDrive');
const DropBox = require('./platforms/DropBox');
const Box = require('./platforms/Box');
const PCloud = require('./platforms/PCloud');
const Youtube = require('./platforms/Youtube');
const YandexDisk = require('./platforms/YandexDisk');
const Vimeo = require('./platforms/Vimeo');
const DailyMotion = require('./platforms/DailyMotion');
const Twitch = require('./platforms/Twitch');

class Drive {
  constructor(service) {
    if (service) {
      this.setService(service);
    }
  }

  setService(service) {
    const Service = Drive.getServiceMappedToDrive()[service];
    this.service = new Service();
    return this;
  }

  static getServiceMappedToDrive() {
    return {
      pcloud: PCloud,
      'google-drive': GoogleDrive,
      dropbox: DropBox,
      box: Box,
      youtube: Youtube,
      'yandex-disk': YandexDisk,
      vimeo: Vimeo,
      dailymotion: DailyMotion,
      twitch: Twitch,
    };
  }

  // Returns oauth instance
  connect() {
    return this.service.connect();
  }

  getAuthUrl(oauth, options) {
    return this.service.getAuthUrl(oauth, options);
  }

  static serviceExists(service) {
    return Drive.getServiceMappedToDrive()[service];
  }

  static isServiceAllowedForFree(service) {
    const forFree = ['google-drive', 'box', 'dropbox'];
    return forFree.includes(service);
  }
  ping() {
    return this.service.ping();
  }

  setToken(token) {
    this.token = token;
    return this;
  }

  getToken() {
    return this.token;
  }

  fetchOauthAccessToken(token, onTokenReceivedCallback) {
    return this.service.fetchOauthAccessToken(token, onTokenReceivedCallback);
  }

  setAccessToken(response) {
    return this.service.setAccessToken(response);
  }

  getAccessToken() {
    return this.service.getAccessToken();
  }

  setRefreshToken(refreshToken) {
    this.service.refreshToken = refreshToken;
    return this;
  }
  getRefreshToken() {
    return this.service.refreshToken;
  }
  setRedirectUriToPublic() {
    if (this.service.setRedirectUriToPublic) {
      this.service.setRedirectUriToPublic();
    }
    return this;
  }

  upload(options, progressLogger, stepLogger, cb) {
    this.service.upload(options, progressLogger, stepLogger, cb);
  }

  getUniqueId(profile) {
    return this.service.getUniqueId(profile);
  }

  refreshAccessToken() {
    return this.service.refreshAccessToken();
  }
  list(folderId) {
    return this.service.list(folderId);
  }

  fileInfo(fileId) {
    return this.service.fileInfo(fileId);
  }
}

module.exports = Drive;
