module.exports = (req, res, next) => {
  if (req.isAuthenticated() && !req.url.includes('/app') && !req.url.includes('api')) {
    return res.redirect('/app');
  }
  return next();
};
