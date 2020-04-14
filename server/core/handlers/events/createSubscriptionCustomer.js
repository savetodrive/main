const subscription = require('../../services/subscription/factory').create();

module.exports = async ({ user }) => {
  try {
    const customerId = await subscription.createCustomer(user);
    await user.update({ subscription: { customer_id: customerId } });
  } catch (e) {
    global.logger.error(e);
  }
};
