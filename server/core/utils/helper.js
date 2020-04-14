const crypto = require('crypto');
const redis = require('redis');

const MAX_SESSION_IN_SECONDS = 86400;

module.exports = {
  /*
   Its formatted validation message
   */
  formattedValMessage: (errors) => errors.map((error) => error.msg),

  /*
   * Encrypt
   * */
  encrypt(plain) {
    const cipher = crypto.createCipher('aes256', process.env.ENCRYPTION_SECRET);
    let cipherText = cipher.update(plain, 'utf8', 'base64');
    cipherText += cipher.final('base64');
    return cipherText;
  },

  decrypt(encrypted) {
    const decipher = crypto.createDecipher('aes256', process.env.ENCRYPTION_SECRET);
    let res = decipher.update(encrypted, 'base64', 'utf8');
    res += decipher.final('utf8');
    return res;
  },

  isProduction: () => process.env.NODE_ENV === 'production',
  isDevelopment: () => process.env.NODE_ENV === 'development',
  createRedisClient({ host, port, password }) {
    return () =>
      redis.createClient({
        host,
        port,
        password,
      });
  },
  destroySession(user) {
    return new Promise((resolve) => {
      global.redis.client.get(JSON.stringify(user._id), (err, sessionId) => {
        if (err || !sessionId) {
          // incase of error or no result we will resolve it
          if (err) global.logger.error(err);
          return resolve();
        }
        return global.sessionStore.destroy(sessionId, () => {
          global.redis.client.del(JSON.stringify(user._id), (error, result) => {
            if (error) {
              global.logger.error(error);
              return resolve(error);
            }
            return resolve(result);
          });
        });
      });
    });
  },
  startRedisSession: (user, sessionId) =>
    new Promise((resolve, reject) => {
      global.redis.client.set(JSON.stringify(user._id), sessionId, 'EX', process.env.MAX_SESSION_IN_SECONDS || MAX_SESSION_IN_SECONDS, (error) => {
        if (error) {
          global.logger.error(error);
          return reject(error);
        }

        return resolve({ user, sessionId });
      });
    }),
};
