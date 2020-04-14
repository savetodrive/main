const Connection = require('../services/connection/Connection');
const Drive = require('../services/drives/Drive');
const differenceInMinutes = require('date-fns/difference_in_minutes');
const isPast = require('date-fns/is_past');

module.exports = {
  index(req, res) {
    new Connection()
      .getAll(req.user._id)
      .lean()
      .then((connections) => {
        res.json(
          connections.map((con) => {
            const currentTime = Date.now();
            let status = false;
            if (con.expires_at) {
              status = !isPast(con.expires_at);
            }
            if (!con.expires_at) {
              status = differenceInMinutes(currentTime, con.updated_at) < 30;
            }
            return { ...con, accessToken: null, status };
          }),
        );
      })
      .catch((err) => {
        global.logger.error(err);
        res.boom.badImplementation();
      });
  },
  show(req, res) {
    new Connection()
      .find({ _id: req.params.connectionId, user_id: req.user._id })
      .then((result) => {
        if (!result) {
          return res.boom.notFound();
        }
        return res.json(result[0]);
      })
      .catch((err) => {
        global.logger.error(err);
        res.boom.badImplementation();
      });
  },
  delete(req, res) {
    new Connection()
      .remove({ _id: req.params.connectionId, user_id: req.user._id })
      .exec()
      .then((result) => {
        if (!result) {
          return res.boom.notFound();
        }
        return res.sendStatus(200);
      })
      .catch((err) => {
        global.logger.error(err);
        res.boom.badImplementation();
      });
  },
  /**
   * If we have expires at and it is not past then sent already stored profile
   * If access token is expired then try to ping if it fails then refresh access token
   *
   */
  async ping(req, res) {
    try {
      const currentTime = Date.now();
      const connection = new Connection();
      const con = await connection.find({ _id: req.params.connectionId, user_id: req.user._id });
      if (!con || (con && !con.length)) {
        return res.boom.unauthorized();
      }

      const connectionDetails = con[0];
      // First check if previous token has expired or not if not then return preserved data
      if (connectionDetails.expires_at && !isPast(connectionDetails.expires_at)) {
        return res.json(connectionDetails.profile);
      }

      if (!connectionDetails.expires_at && differenceInMinutes(currentTime, con.updated_at) < 30) {
        return res.json(connectionDetails.profile);
      }
      const drive = new Drive(connectionDetails.service_type);
      drive.setAccessToken(global.helper.decrypt(connectionDetails.accessToken));
      let refreshToken = null;
      if (connectionDetails.refreshToken) {
        refreshToken = global.helper.decrypt(connectionDetails.refreshToken);
        drive.setRefreshToken(refreshToken);
      }
      // Fetch user details
      const ping = drive.ping();
      if (!ping) {
        return req.error('Failed fetching from service.');
      }
      return ping
        .then(async (user) => {
          if (!user) {
            return res.boom.badImplementation();
          }

          if (user.response && (user.response.status > 400 && user.response.status < 499)) {
            if (!connectionDetails.refreshToken) {
              return req.error('Unable to ping service.', 401);
            }
            // access token seems expired, refresh it, store it and ping again
            const fresh = await drive.refreshAccessToken();
            if (!fresh) {
              return req.error('Unable to ping service.', 401);
            }
            const connection_l = new Connection(connectionDetails.service_type, {
              user_id: req.user._id,
              accessToken: global.helper.encrypt(fresh.access_token),
              refreshToken: global.helper.encrypt(fresh.refresh_token || refreshToken),
            });
            connection_l.setProfile(connectionDetails.profile);
            connection_l.setExpiry(fresh.expiry_date);
            connection_l.setUniqueId(drive.getUniqueId(connectionDetails.profile));
            await connection_l.create();
            return res.json(connectionDetails.profile);
          }
          return res.json(user);
        })
        .catch((e) => {
          global.logger.error(e);
          req.error('Unable to ping service.', 401);
        });
    } catch (error) {
      global.logger.error(error);
      return res.boom.badImplementation();
    }
  },
  listDirectory(req, res) {
    const { connection } = req.params;
    const { folderId } = req.query;
    const mover = new Connection();
    mover
      .setConnectionId(connection)
      .listDirectory(folderId)
      .then((directory) => {
        res.json(directory);
      })
      .catch((error) => {
        global.logger.error(error.message);
        return res.boom.badImplementation();
      });
  },
  file(req, res) {
    const { connection: connectionId, fileId } = req.params;
    const connection = new Connection();
    connection
      .setConnectionId(connectionId)
      .file(fileId)
      .then((file) => res.json(file))
      .catch(() => res.boom.badImplementation());
  },
};
