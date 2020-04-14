/* global global */
const mongoose = require('mongoose');

const uploadsSchema = mongoose.Schema({
  tag_id: Number,
  upload_id: Number,
});

module.exports = mongoose.model('upload_tag', uploadsSchema);
