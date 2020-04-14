require('dotenv').config();

const kue = require('kue');
const redis = require('redis');

// TODO: Refactor this module
const uploadUpdateAndEmailDispatch = require('../server/core/traits/uploadUpdateAndEmailDispatch');

const env = process.env;

const queue = kue.createQueue({
  prefix: 'std_q',
  redis: {
    createClientFactory() {
      return redis.createClient({ host: env.REDIS_HOST, port: env.REDIS_PORT, password: env.REDIS_PASSWORD });
    },
  },
});

queue.process('upload_report_mail', (job, done) => {
  const { data } = job;
  uploadUpdateAndEmailDispatch({
    subject: data.status === 'success' ? 'Upload Success' : 'Upload Failed',
    uuid: data.uuid,
    status: 'FAILED',
    email: data.email,
    message: data.message,
  }).then(() => done(), done);
});
