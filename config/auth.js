/*
 global global
 */
const bcrypt = require('bcrypt');
const passport = require('passport');
const omit = require('lodash/omit');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../server/core/services/User');
const SubscriptionPlans = require('../server/core/model/SubscriptionPlans');
const strings = require('../server/core/Strings');

module.exports = () => {
  const strategy = new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
    User.exists({
      email: username,
    })
      .then((user) => {
        if (user.status === strings.USER_STATUS.EMAIL_NOT_VERIFIED) {
          return done(new Error(`Your account is not active, Please check your email ${user.email}`));
        }
        if (user.status === strings.USER_STATUS.SUSPENDED) {
          return done(new Error(`Your account has been suspended`));
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return done(new Error(`Username/Password didn't matched.`));
        }

        user = global._.pick(user, ['_id', 'email']); // eslint-disable-line
        return done(null, user);
      })
      .catch((e) => {
        done(e || new Error('No User found.'));
      });
  });
  passport.use(strategy);
  passport.serializeUser((user, done) => {
    User.find({ _id: user._id })
      .then((result) => {
        const {
          _id, email, first_name, last_name, subscription,
        } = result;
        const cb = (options = {}) =>
          done(null, {
            _id,
            email,
            first_name,
            last_name,
            subscription,
            plan: null,
            ...options,
          });
        if (!subscription.plan) return cb();
        return SubscriptionPlans.findOne({ _id: subscription.plan })
          .then((data) => {
            cb({ plan: omit(data, ['description']) });
          })
          .catch((error) => {
            global.logger.error(error);
            cb();
          });
      })
      .catch((error) => {
        done(error);
      });
  });

  passport.deserializeUser((user, done) => {
    done(false, user);
  });
  return {
    session: () => passport.session(),
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate(),
  };
};
