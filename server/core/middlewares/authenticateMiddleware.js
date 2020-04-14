module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.url.includes('/app')) {
    return res.redirect('/');
  }
  return res.boom.unauthorized();
};
