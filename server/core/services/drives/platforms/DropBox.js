const request = require('request');
const path = require('path');
const Dbx = require('dropbox');
const DriveInterface = require('./DriveContract');

class DropBox extends DriveInterface {
  constructor(serviceNumber = 0) {
    super(serviceNumber, 'dropbox');
    this.sessionId = null;
    this.accessToken = null;
    this.transferred = 0;
    this.chunkCounter = 0;
    this.breakPoint = 52428800;
    this.currentStream = null;
    this.stream = null;
    this.completed = false;
    this.metaData = {};
    this.progressHandler = null;
    this.completionHandler = null;
    this.stepsLog = null;
    this.uniqueId = 'email';
  }

  connect() {}

  async ping() {
    try {
      const dbx = new Dbx({ accessToken: this.getAccessToken() });
      const response = await dbx.usersGetCurrentAccount();
      return {
        name: response.name.display_name,
        email: response.email,
        img: null,
      };
    } catch (error) {
      throw error;
    }
  }

  requestToken(code, onResponse) {
    request.post(
      {
        url: 'https://api.dropboxapi.com/oauth2/token',
        form: {
          code,
          grant_type: 'authorization_code',
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
          redirect_uri: this.redirect_uri,
        },
      },
      onResponse,
    );
  }

  fetchOauthAccessToken(token, onTokenReceivedCallback) {
    this.requestToken(token, (err, response, body) => {
      if (err || response.statusCode > 299) {
        return onTokenReceivedCallback(new Error(err || 'Error on authentication'), null);
      }

      return onTokenReceivedCallback(null, JSON.parse(body));
    });
  }

  authorize() {
    let authUrl = 'https://www.dropbox.com/1/oauth2/authorize?';
    authUrl += `client_id=${this.config.client_id}`;
    authUrl += `&redirect_uri=${this.redirect_uri}`;
    authUrl += '&response_type=code';
    return authUrl;
  }

  getAuthUrl() {
    return this.authorize();
  }

  async list(folderId = '') {
    folderId = folderId === 'root' ? '' : folderId; // eslint-disable-line
    const dbx = new Dbx({ accessToken: this.getAccessToken() });
    return dbx.filesListFolder({ path: folderId }).then((response) =>
      (response || []).entries.map((entry) => ({
        name: entry.name,
        type: entry.path_lower,
        format: entry['.tag'],
        id: entry.id,
        size: entry.size,
      })),
    );
  }

  async fileInfo(fileId) {
    const dbx = new Dbx({ accessToken: this.getAccessToken() });
    return dbx.filesGetMetadata({ path: fileId }).then((file) => ({
      name: file.name,
      size: file.size,
      id: file.id,
      type: path.extname(file.name),
    }));
  }
}

module.exports = DropBox;
