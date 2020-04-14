const request = require('request');
const util = require('util');

class HttpUrlConnection {
  constructor(url) {
    this.url = url;
    this.request = util.promisify(request);
  }

  getHead() {
    const req = util.promisify(request);
    return req({
      url: this.url,
      method: 'HEAD',
    });
  }
}

module.exports = HttpUrlConnection;
