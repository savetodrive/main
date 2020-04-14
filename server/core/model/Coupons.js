const mongoose = require('mongoose');
const shortid = require('shortid');

const Coupons = mongoose.Schema({
  code: {
    type: String,
    default: shortid.generate,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  starts_at: { type: Date, default: Date.now },
  expires_at: { type: Date, default: () => new Date().setDate(new Date().getDate() + 1) },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('coupons', Coupons);
