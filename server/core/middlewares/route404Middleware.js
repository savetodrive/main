module.exports = (req, res, next) => {
  const routes404 = ['/api/auth', '/build'];
  const isPassed = routes404.every((item) => !req.path.includes(item));
  if (isPassed) {
    return next();
  }
  return res.boom.notFound();
};
