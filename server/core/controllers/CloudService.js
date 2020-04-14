const startCase = require('lodash/fp/startCase');
const bcrypt = require('bcrypt');
const Validator = require('validatorjs');
const Drive = require('../services/drives/Drive');
const guestRules = require('../rules/request/guest');
const filesize = require('filesize');
const UploadProcess = require('../services/upload/UploadProcess');
const strings = require('../Strings');
const differenceInMinutes = require('date-fns/difference_in_minutes');
const prettySize = require('prettysize');
const UploadModel = require('../model/Upload');
const TagModel = require('../model/Tag');
const uploadUpdateAndEmailDispatch = require('../traits/uploadUpdateAndEmailDispatch');
const Connection = require('../services/connection/Connection');
const AdvanceUpload = require('../services/upload/AdvanceUpload');

module.exports = {
  /**
   * This is only public/free users who use service without log in
   */
  ping(req, res) {
    const { service } = req.params;
    const sessionService = req.session.service[service];
    const currentTime = new Date();
    if (!sessionService || !Drive.serviceExists(service)) {
      return req.error('This service is not available.', 401);
    }

    if (sessionService.added_on && differenceInMinutes(currentTime, sessionService.added_on) < 30) {
      const response = Object.assign({}, sessionService);
      delete response.accessToken;
      return res.json(response);
    }

    const drive = new Drive(service);
    drive.setAccessToken(global.helper.decrypt(sessionService.accessToken));
    const ping = drive.ping();

    if (!ping) {
      return req.error('Failed fetching from service.');
    }
    return ping
      .then((user) => {
        if (user.response && user.response.status > 299) {
          return req.error('Unable to ping service.', 401);
        }
        if (!user.response) {
          Object.assign(sessionService, user, {
            status: true,
            added_on: new Date(),
          });
        }
        return res.json(user);
      })
      .catch((e) => {
        global.logger.error(e);
        req.error('Unable to ping service.', 401);
      });
  },

  authenticate(req, res) {
    const serviceQuery = req.query.service;
    if (!serviceQuery || !Drive.serviceExists(serviceQuery)) {
      return req.error('Unrecognized service provider.', 404);
    }

    if (!req.isAuthenticated() && !Drive.isServiceAllowedForFree(serviceQuery)) {
      return req.error('This service is not allowed for free users.', 401);
    }
    const service = new Drive(serviceQuery);

    if (req.query.public) {
      service.setRedirectUriToPublic();
    }

    const oauth = service.connect();
    return res.redirect(service.getAuthUrl(oauth, { user: req.user }));
  },

  onTokenReceived(req, res) {
    const { service } = req.params;
    if (!Drive.serviceExists(service)) {
      return req.error('Service not available.', 500);
    }

    const token = req.query.code;
    const drive = new Drive(service);
    if (!req.user) {
      drive.setRedirectUriToPublic();
    }
    return drive.fetchOauthAccessToken(token, (err, result) => {
      if (err) {
        return req.error('Unable to get access token', 500);
      }
      const { access_token: accessToken, refresh_token: refreshToken = null, expiry_date = null } = result;
      drive.setAccessToken(accessToken);

      if (!req.user) {
        req.session.service[service] = { accessToken: global.helper.encrypt(accessToken) };
        return res.redirect(process.env.FRONTEND_APP_HOST);
      }

      return drive
        .ping()
        .then((profile) => {
          const connection = new Connection(service, {
            user_id: req.user._id,
            accessToken: global.helper.encrypt(accessToken),
            refreshToken: refreshToken ? global.helper.encrypt(refreshToken) : null,
          });
          connection.setProfile(profile);
          connection.setExpiry(expiry_date);
          connection.setUniqueId(drive.getUniqueId(profile));
          connection
            .create()
            .then(() => {
              connection
                .find({ service_type: service, user_id: req.user._id, unique_id: connection.getUniqueId() })
                .then((con) => {
                  if (!con || !con.length) {
                    throw new Error('No connection created.');
                  }
                  delete con[0].accessToken; // eslint-disable-line
                  delete con[0].refreshToken; // eslint-disable-line
                  res.redirect(`${process.env.FRONTEND_APP_HOST}/app/on-authenticated?connection=${JSON.stringify(con[0])}`);
                })
                .catch((connectionFetchError) => {
                  global.logger.error(connectionFetchError);
                  res.boom.badImplementation();
                });
            })
            .catch((error) => {
              global.logger.error(error);
              res.boom.badImplementation();
            });
        })
        .catch((error) => {
          global.logger.error(error);
          res.boom.badImplementation();
        });
    });
  },

  redirect(req, res) {
    const availableServices = ['facebook', 'google'];
    if (availableServices.indexOf(req.params.service) < 0) {
      return res.sendStatus(404);
    }

    if (!req.query.code) {
      return res.sendStatus(401);
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(`Savetodrive${Date.now()}`, salt);
    return res.redirect(`${process.env.FRONTEND_APP_HOST}/create-password/${req.params.service}?hash=${hash}&code=${req.query.code}`);
  },

  remoteUploads(req, res) {
    const payload = req.body;
    const responses = [];
    const models = [];
    const advanceUpload = new AdvanceUpload(payload);
    const maxAllowedMB = req.user.plan.features.bytes_quota;
    advanceUpload
      .create(req.user)
      .then((uploadProcess) => {
        if (!uploadProcess || !uploadProcess.length) {
          return res.boom.badImplementation('No task to process.');
        }
        const bytesUsed = advanceUpload.getPossibleBytesUse();
        if (bytesUsed > maxAllowedMB) {
          return res.boom.unauthorized(`You have only ${filesize(maxAllowedMB - advanceUpload.getBytesUsed())}.`);
        }
        uploadProcess.forEach((process) => {
          process.setSessionId(req.session.id);
          const meta = process.getMeta();
          const dbMeta = Object.assign({}, meta);
          delete dbMeta.progress;
          delete dbMeta.uuid;
          const uploadPayload = {
            user_id: req.user._id,
            url: process.url,
            uuid: meta.uuid,
            meta: dbMeta,
            bytes_used: 0,
            email: process.authProfile.email,
            service: process.cloud,
          };
          models.push(uploadPayload);
          responses.push({
            ...meta,
            processType: startCase(process.processType.toLowerCase()),
            url: process.url,
            size: prettySize(meta.size),
            service: process.cloud,
            progress: {
              percentage: 0,
              transferred: '0 kB',
              remaining: '0 Bytes',
              eta: 0,
              runtime: 1,
              delta: 0,
              speed: '0 kBps',
            },
          });
        });
        global.events.emit(strings.UPLOAD_NEW_FILE, {
          uploadProcess: uploadProcess[0],
        });
        UploadModel.create(models);
        advanceUpload.createUploadQueue({
          userId: req.user._id,
          uploadProcesses: uploadProcess,
        });
        return res.json(responses);
      })
      .catch((error) => {
        res.boom.unauthorized(error.message);
      });
  },

  uploadPublicFiles(req, res) {
    req.body.url = decodeURIComponent(req.body.url);
    const validate = new Validator(req.body, guestRules.publicUpload);
    if (validate.fails()) {
      return res.boom.badData(null, validate.errors);
    }

    const { service } = req.params;
    const serviceInfo = req.session.service[service];
    const { accessToken } = serviceInfo;
    if (!accessToken) {
      return res.boom.unauthorized('No access token found.');
    }

    const sockets = (req.session.sockets || []).map((id) => global.socketClients.get(id)).filter((client) => client);

    const uploadProcess = new UploadProcess(req.body.url, service, accessToken);

    if (req.body.isEmail) {
      uploadProcess.setEmail(req.body.email);
    }

    if (req.body.isFilename) {
      uploadProcess.setFilename(req.body.filename);
    }
    if (req.user) {
      uploadProcess.setUser(req.user);
    }
    uploadProcess.setAuthProfile({ ...serviceInfo, accessToken: null });
    const { maxAllowedMB, bytesUsed } = req.quota || {};
    return uploadProcess
      .setSessionId(req.session.id)
      .getUploadMeta()
      .then((meta) => {
        if (!meta.size) {
          return res.boom.unauthorized("Files with no size can't be uploaded");
        }
        if (parseFloat(meta.size) > process.env.MAX_FILE_SIZE_LIMIT_FOR_FREE_USER_IN_BYTES) {
          return res.boom.unauthorized(`You can only upload file size of upto ${filesize(process.env.MAX_FILE_SIZE_LIMIT_FOR_FREE_USER_IN_BYTES)}`);
        }

        if (bytesUsed + parseFloat(meta.size) > maxAllowedMB) {
          return res.boom.unauthorized(`You have only ${filesize(maxAllowedMB - bytesUsed)} free quota left for this month.`);
        }

        const dbMeta = Object.assign({}, meta);
        delete dbMeta.progress;
        delete dbMeta.uuid;
        const uploadPayload = {
          unique_id: serviceInfo.email,
          url: req.body.url,
          uuid: meta.uuid,
          meta: dbMeta,
          bytes_used: meta.size || 0,
          email: req.session.service[service].email,
          service,
        };
        if (req.user) {
          uploadPayload.user_id = req.user._id;
        }
        return UploadModel.create(uploadPayload, (uploadModelError, saved) => {
          if (uploadModelError || !saved) {
            global.logger.error(uploadModelError);
            return res.boom.badImplementation();
          }
          global.events.emit(strings.UPLOAD_NEW_FILE, {
            uploadProcess,
            sockets,
          });
          return req.success(
            Object.assign(meta, {
              url: req.body.url,
              size: prettySize(meta.size),
              progress: {
                percentage: 0,
                transferred: '0 kB',
                remaining: '0 Bytes',
                eta: 0,
                runtime: 1,
                delta: 0,
                speed: '0 kBps',
              },
            }),
          );
        });
      })
      .catch((err) => {
        global.logger.error(err);
        res.boom.badImplementation('Unable to fetch resource from provided url.');
      });
  },

  killProcess(req, res) {
    try {
      const uuid = req.params.processId;
      const process = global.uploadProcess.get(uuid);
      if (process) {
        process.kill();
        global.uploadProcess.delete(uuid);
        uploadUpdateAndEmailDispatch({
          subject: 'UPLOAD STOPPED',
          uuid,
          status: 'STOPPED',
          email: null,
        });
        return req.success('Task killed successfully.');
      }

      return res.boom.badRequest('Task already stopped.');
    } catch (err) {
      global.logger.error(err);
      return res.boom.badImplementation('Unable to kill process.');
    }
  },

  getTags(req, res) {
    TagModel.find(
      {
        text: {
          $regex: new RegExp(req.query.search, 'ig'),
        },
      },
      { text: 1, _id: 0 },
      { lean: true },
    )
      .limit(5)
      .then((data) => {
        const transformed = data.map((item) =>
          Object.assign({}, item, {
            value: item.text,
          }),
        );
        res.json(transformed);
      })
      .catch(() => res.boom.badImplementation());
  },

  getUrlMeta(req, res) {
    if (!req.query.url) {
      return res.boom.badData('Please provide url.');
    }

    const uploadProcess = new UploadProcess(req.query.url, null, null);
    return uploadProcess
      .getUploadMeta()
      .then((meta) =>
        res.json(
          Object.assign({}, meta, {
            headers: uploadProcess.headers,
          }),
        ),
      )
      .catch(() => res.boom.badRequest('Malformed url'));
  },

  getServices(req, res) {
    return res.json([
      {
        type: 'drive',
        name: 'Google Drive',
        id: 'google-drive',
      },
      {
        type: 'drive',
        name: 'Box',
        id: 'box',
      },
      {
        type: 'drive',
        name: 'Dropbox',
        id: 'dropbox',
      },
      {
        type: 'drive',
        name: 'Yandex Disk',
        id: 'yandex-disk',
      },
      {
        type: 'drive',
        name: 'pCloud',
        id: 'pcloud',
      },
      {
        type: 'video',
        name: 'Youtube',
        id: 'youtube',
      },
      {
        type: 'video',
        name: 'DailyMotion',
        id: 'dailymotion',
      },
    ]);
  },
};
