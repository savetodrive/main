const credits = require('../../../../../config/drives').drives;

class DriveContract {
  constructor(serviceNumber = 0, serviceName) {
    this.config = credits[serviceName][serviceNumber];
    this.accessToken = null;
    this.redirect_uri = this.config.redirect_uri;
  }

  getUniqueId(profile) {
    return profile[this.uniqueId || 'email'];
  }
  /**
   * If we want to set redirect uri on fly
   * @param uri
   */
  setRedirectUriToPublic() {
    this.redirect_uri = this.config.public_redirect_uri;
  }
  setAccessToken(accessToken) {
    this.accessToken = accessToken;
    return this;
  }
  getAccessToken() {
    return this.accessToken;
  }
  connect() {}

  getAuthUrl() {
    throw new Error(`Method not implemented`);
  }

  fetchOauthAccessToken() {
    throw new Error(`Method not implemented`);
  }

  async ping() {
    throw new Error(`Method not implemented`);
  }
  setToken(token) {
    this.token = token;
    return this;
  }

  getToken() {
    return this.token;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }

  refreshAccessToken() {}

  accessTokenFactory({ access_token = null, refresh_token = null, expiry_date = null }) {
    return {
      access_token,
      refresh_token,
      expiry_date,
    };
  }

  createExpiryFromNowBySeconds(seconds) {
    return Date.now() + seconds * 1000; // eslint-disable-line
  }
  async list() {
    return Promise.resolve([]);
  }

  fileInfo() {}
}

module.exports = DriveContract;
