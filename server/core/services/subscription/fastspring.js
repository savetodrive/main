const crypto = require('crypto');
const fs = require('fs');
const { promisify } = require('util');
const request = require('request-promise-native');
const memoryCache = require('memory-cache');

const stateManager = require('./stateManager');
const WebhookHandlingFailed = require('./WebhookHandlingFailed');
const WebhookProcessed = require('./WebhookProcessed');

const { FASTSPRING_USERNAME, FASTSPRING_PWD, FASTSPRING_WEBHOOK_SECRET } = process.env;

const baseRequest = request.defaults({
  // baseUrl: `https://${FASTSPRING_USERNAME}:${FASTSPRING_PWD}@api.fastspring.com/`,
  baseUrl: 'https://api.fastspring.com/',
  headers: {
    'User-Agent': 'SaveToDrive',
  },
  auth: {
    user: FASTSPRING_USERNAME,
    pass: FASTSPRING_PWD,
  },
  resolveWithFullResponse: true,
});

exports.createCustomer = async (user) => {
  const response = await baseRequest({
    method: 'POST',
    url: '/accounts',
    json: true,
    body: {
      contact: {
        first: user.first_name,
        last: user.last_name,
        email: user.email,
      },
    },
    jsonReviver: true,
  });

  return response.body.account;
};

// exports.subscribe = async (user, plan) => {
//   const response = await baseRequest({
//     method: 'POST',
//     url: '/orders',
//     json: true,
//     body: {
//       account: user.subscription.customer_id,
//     }
//   });
// };

exports.secureData = async (payload) => {
  let privateKey = memoryCache.get('fastspring_store_builder_private_key');

  if (!privateKey) {
    privateKey = await promisify(fs.readFile)('storage/subscription-key.pem');
  }

  const aesKey = crypto.randomBytes(16);
  const iv = Buffer.from('');
  const cipher = crypto.createCipheriv('aes-128-ecb', aesKey, iv);
  const encryptedPayload = cipher.update(Buffer.from(payload, 'utf8'), 'utf8', 'base64');
  const securePayload = encryptedPayload + cipher.final('base64');
  const secureKey = crypto.privateEncrypt(privateKey, aesKey).toString('base64');
  return {
    securePayload,
    secureKey,
  };
};

/**
 * Validates a FastSpring webhook
 *
 * @param {string} payload    Request Body
 * @param {string} signature  The secret string saved in Dashboard
 */
const isValidSignature = (payload, signature) => {
  const computedSignature = crypto
    .createHmac('sha256', FASTSPRING_WEBHOOK_SECRET)
    .update(payload)
    .digest('base64')
    .toString();
  return signature === computedSignature;
};

exports.webhookSignatureHeaderField = 'x-fs-signature';

exports.handleWebhooks = async (payload, signature) => {
  if (!isValidSignature(payload, signature)) {
    throw new Error('Invalid Signature');
  }

  global.logger.info(payload);

  const parsedPayload = JSON.parse(payload);

  return parsedPayload.events.map(async (event) => {
    try {
      const customerId = ['string', 'undefined'].indexOf(typeof event.data.account) !== -1
        ? event.data.account
        : event.data.account.account;
      switch (event.type) {
        case 'order.approval.pending':
          break;
        case 'subscription.activated': {
          await stateManager.activate(customerId);
          break;
        }
        case 'subscription.deactivated': {
          await stateManager.deactivate(customerId, new Date(event.data.end));
          break;
        }
        // case 'subscription.charge.completed': {
        //   const subscription =
        // }
        default:
          break;
      }
      return Promise.resolve(new WebhookProcessed(event.id));
    } catch (err) {
      global.logger.error(err);
      return Promise.resolve(new WebhookHandlingFailed(event.id));
    }
  });
};

exports.getOrder = async (orderId) => {
  const response = await baseRequest({
    method: 'GET',
    url: `/orders/${orderId}`,
    json: true,
    jsonReviver: true,
  });

  return response.body;
};

exports.cancel = async (subscriptionId) => {
  const response = await baseRequest({
    method: 'DELETE',
    url: `/subscriptions/${subscriptionId}`,
    json: true,
    jsonReviver: true,
  });

  return response.body;
};
