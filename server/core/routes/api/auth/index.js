const api = require('express').Router();
const user = require('../../../controllers/UserController');
const subscription = require('../../../middlewares/subscription');
const protectedApis = require('./protected');
const Payment = require('../../../controllers/PaymentController');
const SubscriptionController = require('../../../controllers/SubscriptionController');

api.get('/me', user.me);
api.post('/me', user.update);
api.get('/payment/client-token', Payment.getBraintreeClientToken);
api.post('/subscribe/plan/:planId', SubscriptionController.subscribe);
api.get('/subscription/secure-data', SubscriptionController.secureData);
api.get('/subscription/verify-order/:orderId', SubscriptionController.verifyOrder);

api.use('/', subscription, protectedApis);
module.exports = api;
//
