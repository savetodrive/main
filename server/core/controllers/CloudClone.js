const startCase = require('lodash/fp/startCase');
const prettySize = require('prettysize');
const CloudCloneService = require('../services/cloud-clone/CloudClone');

module.exports = {
  clone(req, res) {
    const mover = new CloudCloneService();
    mover
      .copy(req.user, req.body)
      .then((process) => {
        const response = {
          ...process.meta,
          processType: startCase(process.processType.toLowerCase()),
          url: null,
          size: prettySize(process.meta.size),
          service: process.destinationMeta.service,
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
