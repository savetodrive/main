const express = require('express');
const user = require('../controllers/UserController');
const guest = require('../controllers/Guest');
const cloudService = require('../controllers/CloudService');
const viewsRoutes = require('./views');
const signUpThroughService = require('../handlers/strategies');
const SubscriptionController = require('../controllers/SubscriptionController');

const router = express.Router();

module.exports = () => {
  router.get('/verify/:hash*', user.verifyHash);
  router.post('/authorize', user.generateToken);
  router.get('/authenticate', cloudService.authenticate);
  router.get('/token/:service/:public?', cloudService.onTokenReceived);
  router.get('/reset/:hash', guest.verifyResetLink);
  router.post('/webhooks/subscription', SubscriptionController.handleWebhooks);

  router.get('/auth/:service', (req, res, next) => {
    if (!signUpThroughService[req.params.service]) {
      return res.sendStatus(404);
    }
    return signUpThroughService[req.params.service].auth()(req, res, next);
  });
  router.get('/service/redirect/:service', cloudService.redirect);
  viewsRoutes(router);
  return router;
};

