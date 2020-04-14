module.exports = (fn) => (req, res, next) => {
  (async () => {
    try {
      await fn(req, res, next);
    } catch (error) {
      global.logger.error(error);
      res.boom.badImplementation(error);
    }
  })();
};
