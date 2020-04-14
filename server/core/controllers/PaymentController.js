const User = require('../services/User');

class PaymentController {
  static getBraintreeClientToken(req, res) {
    const config = {};
    if (req.user.subscription.customer_id) {
      config.customerId = req.user.subscription.customer_id;
    }
    global.braintree.clientToken.generate(config, (err, response) => {
      if (err) {
        global.logger.error(err.message);
        return res.boom.badImplementation('Error fetching data from payment gateway.');
      }

      return req.success({ token: response.clientToken });
    });
  }

  static getAllPlans(req, res) {
    global.braintree.plan.all((err, result) => {
      if (err) {
        global.logger.error(err.message);
        return res.boom.badImplementation('Error fetching plans from payment gateway.');
      }

      return req.success(result);
    });
  }

  static update(req, res) {
    User.find({ id: req.user.id }).then((user) => {
      global.braintree.customer.update(
        user.customer_id,
        {
          creditCard: {
            paymentMethodNonce: req.body.nonce,
            options: {
              updateExistingToken: user.payment_token,
              verifyCard: true,
              makeDefault: true,
            },
          },
        },
        (error, result) => {
          if (error) {
            return res.boom.badImplementation('Invalid payment details');
          }

          if (!result.success) {
            return res.boom.badData(result.message);
          }
          return res.send(200);
        },
      );
    });
  }
}

module.exports = PaymentController;
