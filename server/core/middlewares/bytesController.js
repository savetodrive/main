const startOfMonth = require('date-fns/start_of_month');
const endOfMonth = require('date-fns/end_of_month');
const prettySize = require('prettysize');
const Drive = require('../services/drives/Drive');
const UploadModel = require('../model/Upload');

module.exports = {
  /**
   * Here we validate if user is trying to access not allowed service by url
   */
  restrictedServiceForFreeUser(req, res, next) {
    const { service } = req.params;
    if (!req.isAuthenticated() && !Drive.isServiceAllowedForFree(service)) {
      return res.boom.unauthorized('This service is not allowed for free users.');
    }

    return next();
  },
  /**
   * Here query DB and check if current user has exceeded available free quota.
   * Bytes used will attached to req.user
   */
  freeQuotaChecker(req, res, next) {
    const { serviceInfo } = req;
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());
    return UploadModel.find({ unique_id: serviceInfo.email, created_at: { $gte: startDate, $lte: endDate } }, 'bytes_used')
      .then((data) => {
        const bytesUsed = data.reduce((sum, { bytes_used }) => {
          const s = sum + bytes_used;
          return s;
        }, 0);
        const maxAllowedMB = +process.env.MAX_BYTES_ALLOWED_TO_UPLOAD_IN_CYCLE;
        if (bytesUsed >= maxAllowedMB) {
          return res.boom.unauthorized(`Your free upload quota of ${prettySize(maxAllowedMB)} for this month has finished`);
        }

        req.quota = {
          maxAllowedMB,
          bytesUsed,
        };
        return next();
      })
      .catch((error) => {
        global.logger.error(error);
        res.boom.badImplementation();
      });
  },
};
