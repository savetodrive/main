const api = require('express').Router();
const passport = require('passport');
const guest = require('../../controllers/Guest');
const signUpThroughService = require('../../handlers/strategies');
const cloudService = require('../../controllers/CloudService');
const user = require('../../controllers/UserController');
const sessionMiddleware = require('../../middlewares/session');
const serviceSessionMiddleware = require('../../middlewares/serviceSession');
const googleCaptchaVerify = require('../../middlewares/googleCaptchaVerify');
const SubscriptionController = require('../../controllers/SubscriptionController');
const requestBodyValidation = require('../../middlewares/requestBodyValidation');
const bytesController = require('../../middlewares/bytesController');

api.get('/ping', (req, res) => res.sendStatus(200));
api.get('/services', cloudService.getServices);
api.post('/forgot-password', guest.forgotPassword);
api.post('/login', googleCaptchaVerify, requestBodyValidation('login'), user.login);
api.get('/logout', user.logout);
api.post('/register', googleCaptchaVerify, requestBodyValidation('register'), user.register);
api.post('/new-password/:hash', guest.createNewPassword);
api.get('/ping/:service', cloudService.ping);
api.post(
  '/upload/:service',
  googleCaptchaVerify,
  sessionMiddleware,
  serviceSessionMiddleware,
  bytesController.restrictedServiceForFreeUser,
  bytesController.freeQuotaChecker,
  cloudService.uploadPublicFiles,
);
api.post('/kill/:processId', sessionMiddleware, serviceSessionMiddleware, cloudService.killProcess);
api.get('/tags', cloudService.getTags);
api.get('/url/meta', cloudService.getUrlMeta);
api.get('/subscription/plans', SubscriptionController.plans);
api.post(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/#/register',
  }),
  signUpThroughService.facebook.process,
  user.register,
);
api.post(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/#/register',
  }),
  signUpThroughService.google.process,
  user.register,
);

api.get('/clear/sockets', (req, res) => {
  req.session.sockets = [];
  res.send(200);
});
api.get('/clients', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    total: req.session.sockets.length,
    data: req.session.sockets,
  });
});
api.get('/clients/all', (req, res) => {
  res.send(`Total Clients ${global.socketClients.size}`);
});

// api.get('/test-fail', (req, res, next) => next(new Error('Test Fail')));
// api.get('/test-unhandled-rejection', (req, res) => {
//   setTimeout(() => Promise.reject(new Error('Test unhandled rejection')), 200);
//   res.json({ message: 'Late unhandled rejection' });
// });
//
// api.get('/test-unhandled-exception', (req, res) => {
//   setTimeout(() => {
//     throw new Error('Test unhandled exception');
//   }, 200);
//   res.json({ message: 'Late unhandled exception' });
// });
//
// api.use((req, res, next) => {
//   if (!req.route) {
//     const err = new Error('Not Found');
//     err.status = 404;
//     return next(err);
//   }
//   return next();
// });

module.exports = api;
