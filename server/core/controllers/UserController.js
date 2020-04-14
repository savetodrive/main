const mongoose = require('mongoose');
const passport = require('passport');
const startCase = require('lodash/fp/startCase');
const prettySize = require('prettysize');
const User = require('../services/User');
const Uploads = require('../services/upload/Uploads');
const strings = require('../Strings');
const promiseMiddleware = require('../utils/promiseMiddleware');
const PremiumUploadQueue = require('../model/PremiumUploadQueue');
const subDays = require('date-fns/sub_days');
const { startRedisSession } = require('../utils/helper');

const { _ } = global;

const UserController = {
  logout(req, res) {
    if (req.logout) {
      req.logout();
    }
    res.redirect('/');
  },
  login: (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err || !user) {
        return req.error({ message: err.message || 'No user found' }, 401);
      }
      return req.logIn(user, (loginErr) => {
        if (loginErr) {
          return req.error({ message: err.message }, 401);
        }
        return startRedisSession(user, req.session.id)
          .then(() => res.json(user))
          .catch(() => req.error({ message: 'Unable to login.' }));
      });
    })(req, res, next);
  },

  register: (req) => {
    User.exists({ email: req.body.email })
      .then(() =>
        req.error(
          {
            message: ['Email already exists'],
          },
          422,
        ),
      )
      .catch(() =>
        User.registerWithCoupon(req.body)
          .then((user) => {
            req.success(user);
          })
          .catch((error) => {
            global.logger.error(error);
            return req.error({ message: error.message });
          }),
      );
  },
  /**
   * @TODO hash must be unique
   * @param req
   * @param res
   */
  verifyHash(req, res) {
    User.exists({
      hash: req.params.hash,
    }).then(
      (user) => {
        if (user.status) {
          return res.render(strings.ACCOUNT_ALREADY_ACTIVATED);
        }
        return User.update({ hash: req.params.hash }, { status: 1 }).then(
          () => {
            global.events.emit(strings.EVENT_ACCOUNT_ACTIVATED, { user });
            return req.logIn(user, (loginErr) => {
              if (loginErr) {
                return req.error({ message: loginErr.message }, 401);
              }
              return startRedisSession(user, req.session.id)
                .then(() => {
                  res.redirect('/app');
                })
                .catch(() => req.error({ message: 'Unable to login.' }));
            });
          },
          () => res.send('Unable to activate.').status(500),
        );
      },
      () => res.send('Incorrect verification code.').status(401),
    );
  },

  generateToken(req, res) {
    const { username, password } = req.body;

    if (username && password) {
      return User.login(username, password).then((user) => res.json({ token: User.getToken(user) }), (error) => res.status(401).send(error));
    }
    return res.status(401).send('Unauthorized');
  },

  update: (req) => {
    const user = _.pick(req.body, ['first_name', 'last_name']);
    return User.update({ _id: req.user._id }, user).then(() => req.success({ message: 'Profile has been updated.' }));
  },

  uploads: promiseMiddleware((req, res) => {
    // return uploads.sort('-created_at').then((result) => res.json(result));
    Uploads.paginate({ userId: req.user._id, page: req.query.page, limit: req.query.limit })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        global.logger.error(error);
        return res.boom.badImplementation(error);
      });
  }),

  statistics(req, res) {
    Uploads.find({ user_id: req.user._id }, {}, { lean: true }, (error, result) => {
      if (error) {
        return res.boom.badImplementation('Unable to fetch statistics');
      }

      const statistics = {
        uploads: { size: 0, count: 0 },
      };

      statistics.uploads.count = result.length;
      statistics.uploads.size = result.reduce((prev, item) => prev + Number(item.meta.size), 0);
      return res.json(statistics);
    });
  },

  uploadsInQueue(req, res) {
    const queueClause = {
      user_id: mongoose.Types.ObjectId(req.user._id),
      created_at: { $gte: subDays(new Date(), 1), $lte: new Date() },
    };
    PremiumUploadQueue.find(queueClause)
      .then((data) => {
        const uploads = _.flatten(data.map((item) => item.uploads)).map((upload) => ({
          ...upload.meta,
          size: prettySize(upload.meta.size),
          processType: startCase(upload.processType.toLowerCase()),
          progress: {
            delta: 0,
            eta: 0,
            percentage: 0,
            remaining: '0 Bytes',
            runtime: 1,
            speed: '0 kBps',
            transferred: '0 kB',
          },
          service: upload.cloud,
          url: upload.url,
        }));
        res.json(uploads);
      })
      .catch((error) => {
        global.logger.error(error);
        return res.boom.badImplementation();
      });
  },
  me(req, res) {
    new Uploads()
      .getBytesUsedInMonth(req.user._id)
      .then((bytesUsed) => res.json({ ...req.user, quota: { bytesUsed } }))
      .catch((error) => {
        global.logger.error(error);
        return res.boom.badImplementation();
      });
  },
};
module.exports = UserController;
