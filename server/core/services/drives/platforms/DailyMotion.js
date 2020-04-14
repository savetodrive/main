const request = require('request');
const axios = require('axios');
const querystring = require('querystring');
const DriveInterface = require('./DriveContract');

class DailyMotion extends DriveInterface {
  constructor(serviceNumber = 0) {
    super(serviceNumber, 'dailymotion');
    this.uniqueId = 'name';
  }
  getAuthUrl() {
    return `${this.config.api.auth}?response_type=code&client_id=${this.config.client_id}&redirect_uri=${this.redirect_uri}&scope=${
      this.config.scopes
    }`;
  }
  fetchOauthAccessToken(token, callback) {
    request(
      this.config.api.accessToken,
      {
        method: 'POST',
        form: {
          grant_type: 'authorization_code',
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
          redirect_uri: this.redirect_uri,
          code: token,
        },
      },
      (err, response, body) => {
        if (err) {
          return callback(err);
        }
        if (response.statusCode > 299) {
          return callback(new Error('Unable to authenticate'));
        }
        const res = JSON.parse(body);
        const data = this.accessTokenFactory({
          access_token: res.access_token,
          refresh_token: res.refresh_token,
          expiry_date: this.createExpiryFromNowBySeconds(res.expires_in),
        });
        return callback(null, data);
      },
    );
  }

  async ping() {
    const profile = await new Promise((resolve, reject) => {
      request(
        this.config.api.user,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        },
        (err, response, body) => {
          if (err) {
            return reject(err);
          }
          return resolve(JSON.parse(body));
        },
      );
    });
    return {
      email: '',
      img: '',
      name: profile.username,
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
}
module.exports = DailyMotion;
