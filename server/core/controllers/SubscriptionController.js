const Validator = require('validatorjs');
const subscription = require('../services/subscription/factory').create();
const stateManager = require('../services/subscription/stateManager');
const promiseMiddleware = require('../utils/promiseMiddleware');
const SubscriptionPlansModel = require('../model/SubscriptionPlans');
const WebhookProcessed = require('../services/subscription/WebhookProcessed');
const User = require('../services/User');

module.exports = {
  subscribe: promiseMiddleware(async (req, res) => {
    const validate = new Validator(req.body, {
      provider_plan_code: 'required',
    });
    if (validate.fails()) {
      return res.boom.badData(null, validate.errors);
    }

    let plan;

    try {
      plan = await SubscriptionPlansModel.findOne({ provider_plan_code: req.params.provider_plan_code });
    } catch (e) {
      return res.boom.badData('Invalid provider plan code');
    }

    const result = await subscription.subscribe(req.user, plan);

    return req.login(req.user, () => req.success(result));
    // TODO: better response
  }),
  cancel: promiseMiddleware(async (req) => {
    await subscription.cancel(req.user.subscription.subscription_id);
    await stateManager.cancel(req.user._id);
    global.logger.info(`User ${req.user.first_name} ${req.user.last_name} has successfully cancelled subscription.`);
    return req.login(req.user, () => req.success('User subscription has been successfully cancelled.'));
  }),
  handleWebhooks: promiseMiddleware(async (req, res) => {
    const results = await subscription.handleWebhooks(req.body, req.headers[subscription.webhookSignatureHeaderField]);

    res.status(202).send(
      results
        .filter((result) => result instanceof WebhookProcessed)
        .map((result) => result.eventId)
        .join('\r\n'),
    );
  }),
  plans: promiseMiddleware(async (req, res) => {
    const plans = await SubscriptionPlansModel.find();
    res.json(plans);
  }),
  secureData: promiseMiddleware(async (req, res) => {
    const secureData = await subscription.secureData(
      JSON.stringify({
        // 'contact': {
        //   // TODO: contact info here
        // },
        // accountCustomKey: req.user._id,
        account: req.user.subscription.customer_id,
        timestamp: Date.now(),
      }),
    );
    return res.json(secureData);
  }),
  verifyOrder: promiseMiddleware(async (req, res) => {
    try {
      const user = await User.find({ _id: req.user._id });
      const order = await subscription.getOrder(req.params.orderId);
      if (order.account === user.subscription.customer_id) {
        // TODO: update subscription id as well
        const plan = await SubscriptionPlansModel.findOne({ provider_plan_code: order.items[0].product });
        await stateManager.subscribe(req.user._id, plan, order.items[0].subscription);
        return req.login(req.user, () => req.success(order));
      }
      return res.sendStatus(400);
    } catch (e) {
      global.logger.error(e);
      return res.sendStatus(400);
    }
  }),
};
