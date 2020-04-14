const distanceInWords = require('date-fns/distance_in_words');
const startCase = require('lodash/fp/startCase');
const prettySize = require('prettysize');
const strings = require('../Strings');
const UploadModel = require('../model/Upload');

module.exports = ({
  message = false, subject, uuid, status, email = false, data, uniqueId,
}) => {
  if (!uuid) {
    return false;
  }
  return UploadModel.findOneAndUpdate(
    { uuid },
    {
      status,
      end_at: Date.now(),
      message: message || null,
      bytes_used: data.usedBytes || 0,
      unique_id: uniqueId,
    },
    { new: true, lean: true },
  )
    .then((result) => {
      if (!result) {
        return false;
      }
      if (email || email === null) {
        global.events.emit(strings.SEND_EMAIL, {
          to: email || result.email,
          subject,
          template: {
            name: strings.TEMPLATE_OF_UPLOAD_REPORT,
            data: Object.assign(result, {
              process_time: distanceInWords(result.created_at, result.end_at),
              service: startCase(result.service),
              meta: Object.assign(result.meta, {
                size: prettySize(result.meta.size),
              }),
            }),
          },
        });
      }

      return null;
    })
    .catch((err) => {
      global.logger.error(err);
    });
};
