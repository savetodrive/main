const startCase = require('lodash/fp/startCase');
const prettySize = require('prettysize');
const Torrent = require('../services/torrent/Torrent');

module.exports = {
  explore(req, res) {
    const torrent = new Torrent();
    const isFile = req.body.type === 'file';
    if (isFile && !req.file) return res.boom.badImplementation();
    const identifier = isFile ? req.file.location : req.body[req.body.type];
    return torrent
      .explore(identifier)
      .then((files) =>
        res.json({
          type: req.body.type,
          identifier,
          files,
        }),
      )
      .catch((err) => res.boom.badImplementation(err.message));
  },
  copyToCloud(req, res) {
    const torrent = new Torrent();
    const { destination, source } = req.body;
    torrent
      .copyToCloud(req.user, { source, destination })
      .then((process) => {
        const response = {
          ...process.meta,
          url: null,
          size: prettySize(process.meta.size),
          service: process.destinationMeta.service,
          processType: startCase(process.processType.toLowerCase()),
          progress: {
            percentage: 0,
            transferred: '0 kB',
            remaining: '0 Bytes',
            eta: 0,
            runtime: 1,
            delta: 0,
            speed: '0 kBps',
          },
        };
        res.json(response);
      })
      .catch((err) => {
        global.logger.error(err.message || err);
        res.boom.unauthorized(err.message);
      });
  },
};
