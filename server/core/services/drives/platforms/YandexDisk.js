const request = require('request');
const btoa = require('btoa');
const axios = require('axios');
const path = require('path');
const querystring = require('querystring');
const DriveInterface = require('./DriveContract');

class YandexDisk extends DriveInterface {
  constructor(serviceNumber = 0) {
    super(serviceNumber, 'yandexDisk');
    this.uniqueId = 'name';
  }

  getAuthUrl() {
    return `${this.config.api.auth}?response_type=code&client_id=${this.config.client_id}&redirect_uri=${this.redirect_uri}`;
  }

  fetchOauthAccessToken(code, onTokenReceivedCallback) {
    request(
      {
        method: 'post',
        url: 'https://oauth.yandex.com/token',
        headers: {
          Authorization: `Basic ${btoa(`${this.config.client_id}:${this.config.client_secret}`)}`,
        },
        form: {
          grant_type: 'authorization_code',
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
          refresh_token: res.refresh_token,
          expiry_date: this.createExpiryFromNowBySeconds(res.expires_in),
        });
        return onTokenReceivedCallback(null, data);
      },
    );
  }
  async ping() {
    const profile = await new Promise((resolve, reject) => {
      request.get(
        this.config.api.user,
        {
          headers: {
            Authorization: `OAuth ${this.getAccessToken()}`,
          },
        },
        (err, response, body) => {
          if (err) {
            return reject(err);
          }
          const json = body.split('\n').reduce((prev, now) => {
            const x = now.split(':');
            prev[x[0]] = x[1]; // eslint-disable-line
            return prev;
          }, {});
          json.response = {
            status: response.statusCode,
          };
          return resolve(json);
        },
      );
    });
    return {
      img: null,
      name: profile.firstname,
      email: '',
    };
  }

  async refreshAccessToken() {
    const REFRESH_API = this.config.api.refreshToken;
    try {
      const tokenCallResponse = await axios.post(
        REFRESH_API,
        querystring.stringify({
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
          refresh_token: this.getRefreshToken(),
          grant_type: 'refresh_token',
        }),
        {
          headers: {
            Authorization: `Basic ${btoa(`${this.config.client_id}:${this.config.client_secret}`)}`,
          },
        },
      );
      if (tokenCallResponse.data) {
        const res = tokenCallResponse.data;
        return this.accessTokenFactory({
          access_token: res.access_token,
          refresh_token: res.refresh_token,
          expiry_date: this.createExpiryFromNowBySeconds(res.expires_in),
        });
      }
      return new Error('Unable to refresh token.');
    } catch (e) {
      return e;
    }
  }

  list(folderId) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.config.api.listFolder,
          qs: {
            path: folderId || '/',
          },
          headers: {
            Authorization: `OAuth ${this.getAccessToken()}`,
          },
        },
        (err, response, body) => {
          if (err || response.statusCode > 299) {
            return reject(err || new Error());
          }
          const result = JSON.parse(body);
          if (result.file) {
            return resolve(result);
          }
          const list = result._embedded.items.map((entry) => ({
            name: entry.name,
            type: entry.mime_type,
            format: entry.type === 'dir' ? 'folder' : 'file',
            id: entry.path,
            size: entry.size,
          }));
          return resolve(list);
        },
      );
    });
  }
  async fileInfo(fileId) {
    try {
      const file = await this.list(fileId);
      if (!file) {
        return new Error('No information about file found.');
      }
      return {
        name: file.name,
        size: file.size,
        id: file.id,
        type: path.extname(file.name),
      };
    } catch (err) {
      return err;
    }
  }
}
module.exports = YandexDisk;
