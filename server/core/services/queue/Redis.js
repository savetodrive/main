const redis = require('redis');

class Redis {
  constructor(host, port, password = null) {
    this.host = host;
    this.port = port;
    this.password = password;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client = this.createConnection();

      this.client.on('ready', () => {
        global.logger.info(`Redis server has been started on ${this.host}:${this.port}`);
        resolve();
      });

      this.client.on('error', (error) => {
        reject(error);
      });
    });
  }

  createConnection() {
    return redis.createClient({ host: this.host, port: this.port, password: this.password });
  }

  getClient() {
    return this.client;
  }

  quit() {
    return this.client.quit();
  }

  static exitHandler(error) {
    global.logger.error(`Redis server unable to start on ${this.host}:${this.port}`);
    global.logger.error(error);
    process.exit(0);
  }
}

module.exports = Redis;
