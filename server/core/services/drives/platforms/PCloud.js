const request = require('request');
const path = require('path');
const DriveInterface = require('./DriveContract');

class PCloud extends DriveInterface {
  constructor(serviceNumber = 0) {
    super(serviceNumber, 'pcloud');
    this.uniqueId = 'email';
  }

  async ping() {
    const profile = await new Promise((resolve, reject) => {
      request(
        {
          url: this.config.api.user,
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        },
        (error, r, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(body));
        },
      );
    });
    return {
      img: profile.avatar_url,
      name: profile.email,
      email: profile.email || '',
    };
  }
  getAuthUrl() {
    return `${this.config.api.auth}?client_id=${this.config.client_id}&response_type=code&redirect_uri=${this.redirect_uri}`;
  }

  fetchOauthAccessToken(code, onTokenReceivedCallback) {
    request(
      {
        url: 'https://api.pcloud.com/oauth2_token',
        qs: {
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
          code,
        },
      },
      (err, response, body) => {
        if (err || response.statusCode > 299) {
          return onTokenReceivedCallback(new Error(err || 'Error on authentication'), null);
        }
        const res = JSON.parse(body);
        const data = this.accessTokenFactory({
          access_token: res.access_token,
          refresh_token: null,
          expiry_date: null,
        });
        return onTokenReceivedCallback(null, data);
      },
    );
  }

  list(folderId) {
    return new Promise((resolve, reject) => {
      const file = folderId ? JSON.parse(global.helper.decrypt(folderId)) : null;
      request(
        {
          url: this.config.api.listFolder,
          qs: {
            folderid: file ? file.id : 0,
          },
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        },
        (err, http, body) => {
          if (err || http.statusCode > 299) {
            return reject(err);
          }
          const result = JSON.parse(body);
          if (!result.metadata) return resolve([]);
          const lists = result.metadata.contents.map((entry) => ({
            name: entry.name,
            type: entry.icon,
            format: entry.isfolder ? 'folder' : 'file',
            id: global.helper.encrypt(JSON.stringify({ size: entry.size, name: entry.name, id: entry.isfolder ? entry.folderid : entry.fileid })),
            size: entry.size,
          }));
          return resolve(lists);
        },
      );
    });
  }
  async fileInfo(fileId) {
    return new Promise((resolve, reject) => {
      try {
        const file = JSON.parse(global.helper.decrypt(fileId));
        return resolve({
          name: file.name,
          size: file.size,
          id: file.id,
          type: path.extname(file.name),
        });
      } catch (err) {
        return reject(err);
      }
    });
  }
}

module.exports = PCloud;
