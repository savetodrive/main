const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

exports.connect = async () => {
  const config = global.config();

  // const { host, user, password } = config.database.mongo;
  const { host } = config.database.mongo;

  await mongoose.connect(
    host,
    {
      promiseLibrary: global.Promise,
      // we can pass credentials like this in mongoose 5 but not in mongoose 4
      // user,
      // password,
    },
  );

  global.logger.info(`Connected to mongodb database.`);

  global.db = mongoose;
};
