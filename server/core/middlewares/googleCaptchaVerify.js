const request = require('request');

module.exports = (req, res, next) => {
  const sessionCaptcha = req.session.googleCaptcha;
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  if (sessionCaptcha && sessionCaptcha === req.body.captcha) {
    return next();
  }
  return request(
    {
      url: 'https://www.google.com/recaptcha/api/siteverify',
      method: 'post',
      form: {
        secret: process.env.GOOGLE_RECAPTCHA_SECRET,
        response: req.body.captcha,
        remoteip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      },
    },
    (error, result, body) => {
      if (error) {
        global.logger.error(error);
        return res.boom.badImplementation();
      }
      try {
        const formatBody = JSON.parse(body);
        if (formatBody.success) {
          req.session.googleCaptcha = req.body.captcha;
          return next();
        }
        return res.boom.unauthorized('Invalid captcha code.');
      } catch (e) {
        global.logger.error(e);
        return res.boom.badImplementation();
      }
    },
  );
};
