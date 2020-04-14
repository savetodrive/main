/* global global */
const mongoose = require('mongoose');

const formalStringType = {
  type: String,
  lowercase: true,
};
const uploadsSchema = mongoose.Schema({
  name: formalStringType,
});

module.exports = mongoose.model('tags', uploadsSchema);
