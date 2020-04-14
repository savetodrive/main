module.exports = (req, res, next) => {
  if (!req.session) {
    return res.boom.unauthorized('No Session found.');
  }

  return next();
};
