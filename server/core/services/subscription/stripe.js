const { merge } = require('lodash');
const stripeModule = require('stripe');

const UserModel = require('../../model/User');

const {
  STRIPE_API_TOKEN,
  STRIPE_WEBHOOK_ENDPOINT_SECRET,
} = process.env;

const stripe = stripeModule(STRIPE_API_TOKEN);

/**
 * Create custom on stripe
 * which later can be used while creating payment token.
 */
exports.createCustomer = async () => {
  const customer = await stripe.customers.create(
    { email: this.user.email },
  );

  return customer.id;
};

exports.subscribe = async (user, plan) => {
  const subscription = await stripe.subscriptions.create({
    customer: user.subscription.customer_id,
    items: [
      {
        plan: plan.provider_plan_code,
      },
    ],
  });

  return subscription;
};

exports.cancel = (user) => stripe.subscriptions.del(user.subscription.subscription_id);

exports.webhookSignatureHeaderField = 'stripe-signature';

exports.handleWebhooks = async (payload, signature) => {
  const event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_ENDPOINT_SECRET);

  global.logger.info(event);

  switch (event.type) {
    case 'invoice.payment_succeeded': {
      const user = await UserModel.findOne({
        'subscription.customer_id': event.data.object.customer,
      });

      await user.update({
        subscription: merge(user.subscription.toObject(), {
          is_cancelled: false,
          ends_at: event.data.object.period_end,
        }),
      });
    }
      break;
    default:
      break;
  }

  return true;
};
