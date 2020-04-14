const GoogleAuth = require('google-auth-library');
const querystring = require('querystring');
const axios = require('axios');
const DriveInterface = require('./DriveContract');
const autobind = require('auto-bind');
const path = require('path');

class GoogleDrive extends DriveInterface {
  constructor(serviceNumber = 0) {
    super(serviceNumber, 'googleDrive');
    autobind(this);
    this.uniqueId = 'email';
  }

  connect() {
    const auth = new GoogleAuth();
    this.authClient = new auth.OAuth2(this.config.client_id, this.config.client_secret, this.redirect_uri);
    return this.authClient;
  }

  getAuthUrl(oauth2Client, options = {}) {
    const config = {
      access_type: 'offline',
      scope: this.config.scopes,
    };
    if (options.user) {
      config.approval_prompt = 'force';
    }
    return this.authClient.generateAuthUrl(config);
  }

  async ping() {
    try {
      await this.refreshAccessToken();
      const response = await this.getAxiosClient().get(`/about?fields=user`);
      const data = response.data.user;
      return {
        name: data.displayName,
        email: data.emailAddress,
        img: data.photoLink,
      };
    } catch (error) {
      throw error;
    }
  }

  getAxiosClient() {
    return axios.create({
      baseURL: this.config.host,
      headers: { Authorization: `Bearer ${this.getAccessToken()}` },
      validateStatus: (status) => status < 299,
    });
  }

  fetchOauthAccessToken(token, onTokenReceivedCallback) {
    const oauthClient = this.connect();
    oauthClient.getToken(token, (err, body) => {
      if (body && body.access_token) {
        return onTokenReceivedCallback(null, body);
      }

      return onTokenReceivedCallback(err, null);
    });
  }

  async refreshAccessToken() {
    if (!this.authClient) {
      this.connect();
    }
    try {
      const tokenCallResponse = await axios.post(
        'https://www.googleapis.com/oauth2/v4/token',
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
  async list(folderId = 'root') {
    const fields = 'nextPageToken, files(id, name, parents, mimeType, modifiedTime, size)';
    const parentId = folderId || 'root';
    return this.getAxiosClient()
      .get(`/files?q='${parentId}'+in+parents&fields=${fields}&pageSize=500&orderBy=folder`, {})
      .then(({ data }) =>
        data.files.map((file) => ({
          name: file.name,
          size: file.size,
          id: file.id,
          format: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
          type: path.extname(file.name),
        })),
      )
      .catch((err) => {
        throw err;
      });
  }
  async fileInfo(fileId) {
    const response = await this.getAxiosClient().get(`/files/${fileId}?fields=id,size,name,mimeType`, {});
    const { data: file } = response;
    return {
      name: file.name,
      size: file.size,
      id: file.id,
      type: path.extname(file.name),
    };
  }
}

module.exports = GoogleDrive;
