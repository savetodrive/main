/* eslint-disable no-console, no-param-reassign */
/* global require, global */
require('dotenv').config();
const express = require('express');
const Sentry = require('@sentry/node');
const os = require('os');

const path = require('path');
const appConfig = require('./../../config/app');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const events = require('events');
const expressValidator = require('express-validator');
const loggerFactory = require('./services/Logger/loggerFactory');
const boom = require('express-boom');
const _ = require('lodash');
const Promise = require('bluebird');
const helper = require('./utils/helper');
const session = require('express-session');
const Redis = require('./services/queue/Redis');
const RedisStore = require('connect-redis')(session);
const sharedSession = require('express-socket.io-session');
const aws = require('aws-sdk');
const kue = require('kue');
const databaseService = require('./database/mongo');

const redis = new Redis(appConfig.database.redis.host, appConfig.database.redis.port, appConfig.database.redis.password);
(async () => {
  global.config = () => appConfig;
  global.events = new events.EventEmitter();
  global.helper = helper;
  global.Promsie = Promise;
  global._ = _;
  global.logger = loggerFactory();

  await Promise.all([redis.connect(Redis.exitHandler), databaseService.connect()]);

  const app = express();
  global.app = app;
  global.redis = redis;
  global.socketClients = new Map();
  global.uploadProcess = new Map();

  const spacesEndpoint = new aws.Endpoint(process.env.STORAGE_END_POINT);
  aws.config.update({
    secretAccessKey: process.env.STORAGE_SECRET_KEY,
    accessKeyId: process.env.STORAGE_ACCESS_KEY,
    region: 'nyc3',
  });
  global.s3 = new aws.S3({
    endpoint: spacesEndpoint,
  });

  let auth = require('./../../config/auth');// eslint-disable-line
  let routes = require('./routes');// eslint-disable-line
  const apiRoutes = require('./routes/api');// eslint-disable-line
  const authApiRoutes = require('./routes/api/auth');// eslint-disable-line
  const authenticateMiddleware = require('./middlewares/authenticateMiddleware');// eslint-disable-line

  require('./events'); // eslint-disable-line

  routes = routes(app);
  auth = auth();
  const { port } = appConfig.app;
  const Queue = require('./services/queue/Kue'); // eslint-disable-line

  global.queue = Queue.getInstance();
  global.queue.init();
  global.queue.subscribeToProgress(redis);
  if (process.env.EXPOSE_KUE_CLIENT === 'true') {
    const cors = require('cors'); // eslint-disable-line
    app.use(cors());

    /* Kue ui for development */
    const kueUiExpress = require('kue-ui-express'); // eslint-disable-line
    kueUiExpress(app, '/kue/', '/queue/api');
    app.use('/queue/api', kue.app);
  }
  app.use(boom());
  app.use(logger('dev'));
  app.use('/api', bodyParser.json());
  app.use('/webhooks', bodyParser.text({ type: 'application/json', limit: '500kb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(expressValidator());
  app.use(cookieParser());
  app.use(
    express.static(path.join(__dirname, '../../public'), {
      index: global.helper.isProduction() ? 'index.html' : false,
      setHeaders(res) {
        res.setHeader('Cache-Control', 'public');
      },
    }),
  );
  app.disable('x-powered-by');

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', ['loopback', 'uniquelocal']);
  }
  const redisStore = new RedisStore({
    client: redis.getClient(),
    ttl: +process.env.MAX_SESSION_IN_SECONDS,
  });
  const sessionInstance = session({
    store: redisStore,
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: global.helper.isProduction(),
      // sameSite: 'lax',
    },
  });
  global.sessionStore = redisStore;
  app.use(sessionInstance);
  app.use(auth.initialize());
  app.use(auth.session());

  app.use((req, res, next) => {
    if (!req.session) {
      return next(new Error('Connection to redis has been lost.')); // handle error
    }

    if (!req.session.service) {
      req.session.service = {};
    }

    if (!req.session.sockets) {
      req.session.sockets = [];
    }
    if (!req.session.user) {
      req.session.user = req.user;
    }

    return next(); // otherwise continue
  });
  app.use((req, res, next) => {
    req.error = (data, httpCode) => {
      if (typeof data === 'string') {
        data = {
          message: data,
        };
      }
      data = Object.assign(data || {}, {});
      return res.status(httpCode || 500).send(data);
    };

    req.success = (data, httpCode) => {
      data = Object.assign(data || {}, {});
      return res.status(httpCode || 200).send(data);
    };

    return next();
  });

  // view engine setup
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'jade');
  app.use('/api', apiRoutes);
  app.use('/api/auth', authenticateMiddleware, authApiRoutes);
  app.use('/', routes);

  // Error handler which returns response
  // and logs the error
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    const status = err.status || 500;

    if (status >= 500) {
      global.logger.error(err);
    }

    if (global.helper.isDevelopment()) {
      if (req.originalUrl.indexOf('api') > -1) {
        return res.status(status).json({
          message: err.message,
          error: err,
        });
      }
      return res.status(status).render('error', {
        message: err.message,
        error: err,
      });
    }
    if (req.path.indexOf('api') > -1) {
      return res.status(status).json({
        message: err.message,
        error: err,
      });
    }
    return res.status(status).render('error', {
      errorCode: res.sentry,
      message: 'Some Error Occurred',
      error: '',
    });
  });

  const server = app.listen(port, (err) => {
    if (err) {
      global.logger.error(err);
    } else {
      global.logger.info(`Server is running on http://localhost:${port}`);
      if (process.send) {
        process.send('ready');
      }
    }
  });
  const io = require('./socket')(server);// eslint-disable-line

  io.use(sharedSession(sessionInstance));
  global.io = io;

  const shutdownProcess = (error) => {
    let failed = false;

    if (error) {
      failed = true;
    }

    const quitRedis = () =>
      new Promise((resolve, reject) => {
        redis.getClient().quit();
        redis.getClient().on('end', () => resolve());
        redis.getClient().on('error', (err) => reject(err));
      });

    const exitHandler = (promise) =>
      promise.catch((err) => {
        global.logger.error(err);
        failed = true;
      });

    exitHandler(
      new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);

          return resolve();
        });
      }),
    )
      .then(() => Promise.all([
        (() => {
          if (error) {
            global.logger.error(error);
          }
        })(),
        exitHandler(global.db.disconnect()),
        exitHandler(quitRedis()),
      ]))

      // wait for all errors to be logged
      // or wait for 1.5 seconds timeout and finish
      .then(() => {
        const loggingPromise = new Promise((resolve, reject) => {
          const loggingTimeout = setTimeout(reject, 1500);
          global.logger.on('finish', () => {
            clearTimeout(loggingTimeout);
            resolve();
          });
        });

        global.logger.end();

        return loggingPromise;
      })
      .then(() => process.exit(failed ? 1 : 0))
      .catch(() => process.exit(1));
  };

  // For handling application stop and non-graceful reload
  process.on('SIGINT', () => {
    global.logger.info('Received SIGINT signal.');
    shutdownProcess();
  });

  // For handling application stop and non-graceful reload
  process.on('SIGTERM', () => {
    global.logger.info('Received SIGTERM signal.');
    shutdownProcess();
  });

  // For handling Graceful reload
  process.on('message', (message) => {
    if (message === 'shutdown') {
      global.logger.info('Received shutdown event.');
      shutdownProcess();
    }
  });

  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_NODE_RAVEN_DSN,
      release: process.env.CURRENT_REVISION,
      environment: process.env.APP_ENVIRONMENT,
      serverName: os.hostname(),
      integrations:
        (defaultIntegrations) =>
          [
            ...(defaultIntegrations.filter(integration => integration.name !== 'OnUncaughtException' && integration.name !== 'OnUnhandledRejection')),
            new Sentry.Integrations.OnUncaughtException({ onFatalError: shutdownProcess }),
          ],
    });
    Sentry.configureScope((scope) => {
      scope.setTag('app_type', 'webapp');
    });
  } else {
    process.on('uncaughtException', shutdownProcess);
  }
  process.on('unhandledRejection', (error) => {
    // being strict on unhandledRejection and throwing exception
    // in order to trigger uncaughtException
    // TODO: log the fact that this is an unhandled rejection and logging context like promise
    throw error;
  });
})();
