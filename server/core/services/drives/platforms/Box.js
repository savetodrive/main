const BoxSDK = require('box-node-sdk');
const request = require('request');
const autobind = require('auto-bind');
const path = require('path');
const DriveInterface = require('./DriveContract');

class Box extends DriveInterface {
  constructor(serviceNumber) {
    super(serviceNumber, 'box');
    this.OAUTH_LINK = 'https://account.box.com/api/oauth2/authorize';
    this.ACCESS_TOKEN_LINK = 'https://api.box.com/oauth2/token';
    this.UPLOAD_LINK = 'https://upload.box.com/api/2.0/files/content';
    autobind(this);
    this.uniqueId = 'email';
  }

  init() {
    this.sdk = new BoxSDK({
      clientID: this.config.client_id,
      clientSecret: this.config.client_secret,
    });
  }

  getAuthUrl() {
    return `${this.OAUTH_LINK}?client_id=${this.config.client_id}&response_type=code&redirect_uri=${this.redirect_uri}`;
  }

  fetchOauthAccessToken(code, onTokenReceivedCallback) {
    request(
      {
        url: this.ACCESS_TOKEN_LINK,
        method: 'POST',
        form: {
          grant_type: 'authorization_code',
          code,
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
          redirect_uri: this.redirect_uri,
        },
      },
      (err, response, body) => {
        if (err) {
          return onTokenReceivedCallback(err, null);
        }

        try {
          const res = JSON.parse(body);
          const boxCredits = this.accessTokenFactory({
            access_token: res.access_token,
            refresh_token: res.refresh_token,
            expiry_date: this.createExpiryFromNowBySeconds(res.expires_in),
          });
          if (!boxCredits.access_token) {
            return onTokenReceivedCallback(new Error('No access token.'), null);
          }

          return onTokenReceivedCallback(null, boxCredits);
        } catch (error) {
          return onTokenReceivedCallback(error, null);
        }
      },
    );
  }

  async ping() {
    this.init();
    const client = this.sdk.getBasicClient(this.getAccessToken());
    const profile = await new Promise((resolve, reject) => {
      client.users.get(client.CURRENT_USER_ID, null, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
    return {
      img: profile.avatar_url,
      name: profile.name,
      email: profile.login,
    };
  }

  refreshAccessToken() {
    this.init();
    return new Promise((resolve, reject) => {
      this.sdk.getTokensRefreshGrant(this.getRefreshToken(), (err, tokenInfo) => {
        if (err) {
          return reject(err.message);
        }

        const data = this.accessTokenFactory({
          access_token: tokenInfo.accessToken,
          refresh_token: tokenInfo.refreshToken,
          expiry_date: this.createExpiryFromNowBySeconds(tokenInfo.accessTokenTTLMS),
        });
        return resolve(data);
      });
    });
  }

  async list(folderId = 0) {
    this.init();
    const client = this.sdk.getBasicClient(this.getAccessToken());
    return client.folders.get(folderId || 0).then((folder) =>
      folder.item_collection.entries.map((entry) => ({
        name: entry.name,
        type: entry.type,
        format: entry.type,
        id: entry.id,
        size: entry.size,
      })),
    );
  }

  async fileInfo(fileId) {
    this.init();
    const client = this.sdk.getBasicClient(this.getAccessToken());
    const file = await client.files.get(fileId);
    return {
      name: file.name,
      size: file.size,
      id: file.id,
      type: path.extname(file.name),
    };
  }
}

module.exports = Box;
