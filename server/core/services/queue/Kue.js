const kue = require('kue');
const redis = require('redis');
const { MAIN_UPLOAD_QUEUE } = require('../../Strings');
const uploadUpdateAndEmailDispatch = require('../../traits/uploadUpdateAndEmailDispatch');
const startCase = require('lodash/fp/startCase');
const strings = require('../../Strings');
const AdvanceUpload = require('../../services/upload/AdvanceUpload');

const { env } = process;

class Kue {
  constructor() {
    if (Kue.INSTANCE) {
      throw new Error('Kue Instance already created');
    }
    this._queue = null;
    this.continueUploadHandler = this.continueUploadHandler.bind(this);
  }

  init() {
    this._queue = kue.createQueue({
      prefix: 'std_q',
      redis: {
        createClientFactory() {
          return redis.createClient({ host: env.REDIS_HOST, port: env.REDIS_PORT, password: env.REDIS_PASSWORD });
        },
      },
      jobEvents: false,
    });
  }

  get() {
    return this._queue;
  }

  static getInstance() {
    if (!Kue.INSTANCE) {
      Kue.INSTANCE = new Kue();
    }

    return Kue.INSTANCE;
  }

  handleUploadRequests(uploadProcess) {
    const job = this._queue
      .create(MAIN_UPLOAD_QUEUE, uploadProcess)
      .priority('high')
      .removeOnComplete(true)
      .save(() => {
        global.logger.info('New Task has been created');
      });
    return job;
  }
  progressBySession(sessionId, { type, uploadProcess, data }) {
    global.sessionStore.get(sessionId, (err, session) => {
      if (err) {
        return false;
      }
      if (!session) return false;
      try {
        session.sockets.forEach((socketId) => {
          const client = global.io.sockets.connected[socketId];
          if (client) {
            client.emit(type, { ...(data.progress || data), uuid: uploadProcess.meta.uuid });
          }
        });
        return true;
      } catch (error) {
        global.logger.error(error);
        return false;
      }
    });
  }
  _handleUploadLogs({ type, uploadProcess, data }) {
    if (uploadProcess.user && uploadProcess.user._id) {
      return global.redis.client.get(JSON.stringify(uploadProcess.user._id), (error, reply) => {
        if (error) {
          global.logger.error(error);
          return false;
        }
        if (!reply) return false;
        return this.progressBySession(reply, { type, uploadProcess, data });
      });
    }
    if (!uploadProcess.sessionId) return false;
    return this.progressBySession(uploadProcess.sessionId, { type, uploadProcess, data });
  }
  continueUploadHandler(data) {
    return ({ status, queue, message }) => {
      if (status) return;
      if (!status && !queue) return;
      try {
        queue.forEach((uploadProcess) => {
          uploadUpdateAndEmailDispatch({
            subject: startCase('UPLOAD_FAILED'),
            uuid: uploadProcess.meta.uuid,
            status: 'FAILED',
            email: uploadProcess.user.email,
            message,
            uniqueId: uploadProcess.authProfile.email,
            data: data.data,
          });
          data.data.message = message; // eslint-disable-line
          data.data.type = 'error'; // eslint-disable-line
          data.data.usedBytes = 0; // eslint-disable-line

          this._handleUploadLogs({ ...data, uploadProcess, type: 'UPLOAD_FAILED' });
        });
      } catch (err) {
        global.logger.error(err);
      }
    };
  }
  subscribeToProgress(lRedis) {
    const sub = lRedis.createConnection();
    sub.on('message', (channel, message) => {
      const data = JSON.parse(message);
      const { uploadProcess } = data;
      switch (data.type) {
        case 'UPLOAD_PROGRESS':
        case 'UPLOAD_LOGS':
          this._handleUploadLogs(data);
          break;
        case 'task:complete':
          data.data.type = 'success';
          uploadUpdateAndEmailDispatch({
            subject: startCase('UPLOAD_SUCCESS'),
            uuid: uploadProcess.meta.uuid,
            status: 'COMPLETED',
            email: uploadProcess.email,
            uniqueId: uploadProcess.authProfile.email,
            data: data.data,
          });
          this._handleUploadLogs({ ...data, type: 'UPLOAD_SUCCESS' });
          if (uploadProcess.groupId && uploadProcess.user) {
            AdvanceUpload.continueUpload(data).then(this.continueUploadHandler(data));
          }
          break;
        case 'task:error':
          {
            data.data.type = 'error';
            const email = uploadProcess.email || uploadProcess.user ? uploadProcess.user.email : null;
            const { uuid } = uploadProcess.meta.uuid;
            global.logger.info({
              message: data.data.message,
              email,
              uuid,
            });
            data.data.message = `Sorry! there was some problem while uploading`;
            uploadUpdateAndEmailDispatch({
              subject: startCase('UPLOAD_FAILED'),
              uuid,
              status: 'FAILED',
              email,
              message: `${uuid}:${data.data.message}`,
              uniqueId: uploadProcess.authProfile.email,
              data: data.data,
            });
            this._handleUploadLogs({ ...data, type: 'UPLOAD_FAILED' });
            if (uploadProcess.groupId && uploadProcess.user) {
              AdvanceUpload.continueUpload(data)
                .then(this.continueUploadHandler(data))
                .catch((err) => {
                  global.logger.error(err);
                });
            }
          }
          break;
        default:
          break;
      }
    });
    sub.subscribe(strings.UPLOAD_LOGS);
  }
}

Kue.INSTANCE = null;
module.exports = Kue;
