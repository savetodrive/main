const vimeo = require('vimeo');
const DriveInterface = require('./DriveContract');

class Vimeo extends DriveInterface {
  constructor(serviceNumber = 0) {
    super(serviceNumber, 'vimeo');
    this.client = new vimeo.Vimeo(this.config.client_id, this.config.client_secret);
    this.uniqueId = 'name';
  }

  getAuthUrl() {
    return this.client.buildAuthorizationEndpoint(this.redirect_uri, this.config.scopes, 'std');
  }

  fetchOauthAccessToken(code, callback) {
    this.client.accessToken(code, this.redirect_uri, (err, response) => {
      if (err) {
        return callback(err, null);
      }

      if (response.access_token) {
        callback(null, response.access_token);
      }
      return callback(new Error('Unknow error occured while fetching token'), null);
    });
  }
  async ping() {
    this.client.setAccessToken(this.getAccessToken());
    const data = await new Promise((resolve, reject) => {
      this.client.request(
        /* options */ {
          path: '/me',
        },
        /* callback */ (error, body, statusCode) => {
          if (error || statusCode > 399) {
            return reject(error || new Error('Unable to fetch profile because of bad request.'));
          }

          return resolve(body);
        },
      );
    });
    return {
      name: data.name,
      email: '',
      img: '',
    };
  }
}
module.exports = Vimeo;
