const GoogleAuth = require('google-auth-library');
const querystring = require('querystring');
const axios = require('axios');
const DriveInterface = require('./DriveContract');

class Youtube extends DriveInterface {
  constructor(serviceNumber = 0) {
    super(serviceNumber, 'youtube');
    this.SCOPES = this.config.scopes;
    this.uniqueId = 'name';
  }

  connect() {
    const auth = new GoogleAuth();
    return new auth.OAuth2(this.config.client_id, this.config.client_secret, this.redirect_uri);
  }

  getAuthUrl(oauth2Client) {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
  }

  async ping() {
    try {
      const response = await this.getAxiosClient().get(
        `channels?part=snippet&mine=true
        `,
      );
      const data = response.data.items[0].snippet;
      return {
        name: data.title,
        email: '',
        img: data.thumbnails.default.url,
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
        const res = body;
        const data = this.accessTokenFactory({
          access_token: res.access_token,
          refresh_token: res.refresh_token,
          expiry_date: res.expiry_date,
        });
        return onTokenReceivedCallback(null, data);
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
}

module.exports = Youtube;
