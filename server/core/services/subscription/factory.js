const { SUBSCRIPTION_DRIVER } = process.env;

/* eslint-disable */
exports.create = () => require(`./${SUBSCRIPTION_DRIVER || 'fastspring'}`);
/* eslint-disable */
