const UserModel = require('../../model/User');
const crypto = require('crypto');

class Guest {
  find(document) {
    return UserModel.findOne(document).exec();
  }

  update(condition, document, ...args) {
    return UserModel.update(condition, document, ...args);
  }

  static generateUniqueHash(key = '') {
    return crypto
      .createHash('sha256')
      .update(key + Date.now())
      .digest('hex');
  }
}

module.exports = Guest;
