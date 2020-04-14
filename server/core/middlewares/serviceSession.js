module.exports = (req, res, next) => {
  if (!Object.keys(req.session.service).length) {
    return res.boom.unauthorized('Unauthorized access.');
  }
  const { service } = req.params;
  const serviceInfo = req.session.service[service];
  if (!serviceInfo) {
    return res.boom.badImplementation();
  }
  req.serviceInfo = serviceInfo;
  return next();
};
