/* global global */
const mongoose = require('mongoose');

const formalStringType = {
  type: String,
  lowercase: true,
};
const connection = mongoose.Schema({
  group_id: formalStringType,
  user_id: mongoose.Schema.Types.ObjectId,
  uploads: { type: Array, default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('premium_upload_queue', connection);
