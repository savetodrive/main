const request = require('request');
const DriveInterface = require('./DriveContract');

class Twitch extends DriveInterface {
  constructor(serviceNumber = 0) {
    super(serviceNumber, 'twitch');
  }
  getAuthUrl() {
    return `${this.config.api.auth}?client_id=${this.config.client_id}&redirect_uri=${
      this.redirect_uri
    }&response_type=code&scope=${this.config.scopes.join(' ')}&force_verify=true`;
  }

  fetchOauthAccessToken(code, callback) {
    request(
      this.config.api.accessToken,
      {
        method: 'POST',
        form: {
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirect_uri,
        },
      },
      (err, response, body) => {
        if (err) {
          return callback(err);
        }
        if (response.statusCode > 299) {
          return callback(new Error('Unable to authenticate'));
        }

        return callback(null, JSON.parse(body).access_token) || callback(new Error('No access token found'));
      },
    );
  }
  async ping() {
    const profile = await new Promise((resolve, reject) => {
      request(
        this.config.api.user,
        {
          headers: {
            'Client-ID': this.config.client_id,
            Authorization: `OAuth ${this.getAccessToken()}`,
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
      channel_id: profile._id,
      email: profile.email,
      img: profile.logo,
      name: profile.display_name,
    };
  }
}
module.exports = Twitch;
