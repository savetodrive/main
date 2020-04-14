module.exports = (req, res, next) => {
  const isApi = req.originalUrl.includes('api/auth');
  if (!req.user.subscription.active && req.url !== '/app/subscribe') {
    if (isApi) {
      return res.sendStatus(402);
    }
    return res.redirect('/app/subscribe');
  }

  return next();
};
