const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const isPast = require('date-fns/is_past');
const isFuture = require('date-fns/is_future');
const Coupon = require('../Coupon');
const UserModel = require('../../model/User');
const strings = require('../../Strings');

const { Promise, _ } = global;

class User {
  static getToken(user) {
    const cfg = global.config();
    return jwt.encode(user, cfg.auth.jwt.secret);
  }

  static getSalt() {
    return bcrypt.genSaltSync(10);
  }

  static generatePassword(password, salt) {
    return bcrypt.hashSync(password, salt);
  }

  static find(clause) {
    return new Promise((resolve, reject) => {
      UserModel.findOne(clause, (error, user) => {
        if (error || !user) {
          return reject(new Error('No User found'));
        }

        user = _.omit(user, ['password']); // eslint-disable-line
        return resolve(user);
      });
    });
  }

  static exists(filter) {
    return new Promise((resolve, reject) => {
      UserModel.findOne(filter, (error, user) => {
        if (user) {
          return resolve(user);
        }

        return reject(new Error('Sorry! No account found with provided details.'));
      });
    });
  }

  static update(condition, update) {
    return new Promise((resolve, reject) => {
      UserModel.update(condition, update, (error, user) => {
        if (error) {
          return reject(error);
        }

        return resolve(user);
      });
    });
  }

  static login(username, password) {
    return new Promise((resolve, reject) =>
      User.exists({
        email: username,
      })
        .then((user) => {
          if (!user.status) {
            return reject(new Error(`Your account is not active, Please check your email ${user.email}`));
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return reject(new Error(`Username/Password didn't matched.`));
          }

          user = global._.pick(user, ['_id', 'email']); // eslint-disable-line
          return resolve({
            token: User.getToken(user),
          });
        })
        .catch((error) => {
          global.logger.error(error);
          return reject(new Error('No User found.'));
        }),
    );
  }

  static async registerWithCoupon({
    email, password, first_name, last_name, service, coupon: couponCode,
  }) {
    try {
      if (!(couponCode || '').trim()) {
        throw new Error(strings.INVALID_COUPON);
      }
      const couponService = new Coupon(couponCode);
      const coupon = await couponService.get();
      // First we check if coupon is available
      if (!coupon) {
        throw new Error(strings.INVALID_COUPON);
      }
      // If coupon is assigned to any user
      if (coupon.user_id) {
        throw new Error(strings.COUPON_ALREADY_USED);
      }
      // If coupon has not activated yet
      if (isFuture(coupon.starts_at)) {
        throw new Error(strings.COUPON_NOT_ACTIVATED);
      }
      // If coupon has expired
      if (isPast(coupon.expires_at)) {
        throw new Error(strings.COUPON_EXPIRED);
      }
      const user = await User.register({
        email,
        password,
        first_name,
        last_name,
        service,
      });
      await couponService.assignToUser(user._id);
      return user;
    } catch (err) {
      throw err;
    }
  }

  static async register({
    email, password, first_name, last_name, service,
  }) {
    const salt = User.getSalt();
    let newPassword;
    if (password) {
      newPassword = User.generatePassword(password, salt);
    }
    const hash = bcrypt.hashSync(email + Date.now(), salt).replace(/\/|\\/g, '-');
    const registerInfo = {
      email,
      password: newPassword,
      first_name,
      last_name,
      hash,
    };
    if (service) {
      registerInfo.status = 1;
      registerInfo.social = service;
    }

    return new Promise((resolve, reject) =>
      UserModel.create(registerInfo, (error, user) => {
        if (error) {
          global.logger.error(error);
          return reject(new Error(strings.ADD_USER_ERROR));
        }

        /* Send mail about account verification */
        if (!registerInfo.social) {
          global.events.emit(strings.SEND_EMAIL, {
            to: user.email,
            subject: strings.ACCOUNT_ACTIVATION,
            template: {
              name: strings.TEMPLATE_OF_EMAIL_VERIFICATION,
              data: {
                hash,
                user,
              },
            },
          });
        }

        const newUser = global._.pick(user, ['_id', 'email']);
        return resolve(newUser);
      }),
    );
  }
}

module.exports = User;
