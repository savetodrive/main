const rules = require('../rules/request/guest');

module.exports = (validation) => (req, res, next) => {
  rules[validation]
    .validate(req.body)
    .then((valid) => {
      if (valid) {
        return next();
      }
      return res.boom.badImplementation();
    })
    .catch((error) => {
      req.error(
        {
          message: error.message,
          errors: error.errors,
        },
        422,
      );
    });
};
