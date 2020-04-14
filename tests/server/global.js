require('dotenv').config();
const config = require('../../config/app');
const Logger = require('../../server/core/services/Logger');

global.config = () => config;
global.logger = new Logger().setEnv('test').get();
