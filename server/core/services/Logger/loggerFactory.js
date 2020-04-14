const winston = require('winston');
const Transport = require('winston-transport');
const path = require('path');
const LogzioWinstonTransport = require('winston-logzio');
const Sentry = require('@sentry/node');
const os = require('os');

const {
  combine,
  timestamp,
  json,
  colorize,
  printf,
} = winston.format;

class SentryExceptionLogger extends Transport {
  constructor(opts) {
    super(opts);
    this.name = 'sentry';
    this.level = 'error';
  }

  async log(error, callback) {
    await Sentry.captureException(error);

    // wait 1 sec for the logging to be completed
    // TODO: find a better mechanism to wait for the logging to be done
    setTimeout(callback, 1000);
  }
}


module.exports = (isConsoleCommand = false) => {
  const date = new Date();

  const transports = [
    new winston.transports.File({
      level: 'info',
      filename: path.join('storage/logs', `${date.getYear()}-${date.getMonth() + 1}-${date.getDate()}.log`),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ];

  if (!global.helper.isProduction()) {
    transports.push(new winston.transports.Console({
      level: 'debug',
    }));
  } else if (isConsoleCommand) {
    transports.push(new winston.transports.Console({
      level: 'info',
    }));
  }

  if (global.helper.isDevelopment()) {
    transports.push(new winston.transports.File({
      filename: path.join('storage/logs', 'exceptions.log'),
      name: 'exception_file',
      level: 'error',
    }));
  } else if (global.helper.isProduction()) {
    transports.push(new SentryExceptionLogger());
    transports.push(new LogzioWinstonTransport({
      level: 'info',
      name: 'winston_logzio',
      token: process.env.LOGZ_IO_TOKEN,
    }));
  }

  const prodFormat = () => {
    const replaceError = ({
      label, level, message, stack,
    }) => ({
      label, level, message, stack,
    });
    const replacer = (key, value) => (value instanceof Error ? replaceError(value) : value);
    return combine(timestamp(), json({ replacer }));
  };

  const devFormat = () => {
    const formatMessage = info => `${info.level} ${info.message}`;
    const formatError = info => `${info.level} ${info.message}\n\n${info.stack}\n`;
    const format = (info) => (info instanceof Error ? formatError(info) : formatMessage(info));
    return combine(colorize(), printf(format));
  };

  const logger = winston.createLogger({
    level: global.helper.isProduction() ? 'info' : 'silly',
    transports,
    exitOnError: false,
    defaultMeta: { app_type: 'webapp', server_name: os.hostname() },
    // Inspired by https://github.com/winstonjs/winston/issues/1243#issuecomment-423558375
    format: global.helper.isProduction() ? prodFormat() : devFormat(),
  });

  logger.emitErrs = true;

  return logger;
};
