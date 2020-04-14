/* global global */
const mongoose = require('mongoose');

const subscriptionPlans = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  provider_plan_code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: Array,
    default: [],
  },
  billing_cycle_month: {
    type: Number,
    default: 1,
  },
  features: {
    bytes_quota: {
      type: Number,
      required: true,
    },
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('subscription_plans', subscriptionPlans);
