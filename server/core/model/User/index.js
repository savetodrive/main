/* global global */
const mongoose = require('mongoose');

const formalStringType = {
  type: String,
  lowercase: true,
};
const userSchema = mongoose.Schema({
  first_name: formalStringType,
  last_name: formalStringType,
  email: formalStringType,
  password: String,
  status: {
    type: Number,
    default: 0,
  },
  hash: String,
  fp_hash: String,
  social: String,
  lastLogin: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  subscription: {
    subscription_id: String,
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'subscription_plans' },
    // ends_at: { type: Date, default: Date.now },
    // starts_at: { type: Date, default: Date.now },
    is_cancelled: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    customer_id: String,
  },
});

module.exports = mongoose.model('users', userSchema);
