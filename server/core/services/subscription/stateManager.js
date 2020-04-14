const UserModel = require('../../model/User');

exports.subscribe = (userId, plan, subscriptionId) =>
  UserModel.findOneAndUpdate(
    { _id: userId },
    { 'subscription.plan': plan, 'subscription.subscription_id': subscriptionId, 'subscription.active': true },
  )
    .exec();

exports.cancel = (userId) =>
  UserModel.findOneAndUpdate(
    { _id: userId },
    { 'subscription.is_cancelled': true },
  )
    .exec();

exports.resume = (userId) =>
  UserModel.findOneAndUpdate(
    { _id: userId },
    { 'subscription.is_cancelled': false },
  )
    .exec();

exports.activate = (customerId) =>
  UserModel.findOneAndUpdate(
    { 'subscription.customer_id': customerId },
    { 'subscription.active': true },
  )
    .exec();

exports.deactivate = (customerId) =>
  UserModel.findOneAndUpdate(
    { 'subscription.customer_id': customerId },
    { 'subscription.active': false },
  )
    .exec();
