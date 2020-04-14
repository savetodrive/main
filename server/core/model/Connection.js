/* global global */
const mongoose = require('mongoose');

const formalStringType = {
  type: String,
  lowercase: true,
};
const connection = mongoose.Schema({
  service_type: formalStringType,
  user_id: String,
  profile: { type: Object, default: {} },
  refreshToken: formalStringType,
  accessToken: formalStringType,
  expires_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('connections', connection);
