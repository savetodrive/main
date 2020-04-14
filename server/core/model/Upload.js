const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const { PROCESS_TYPE, PROCESS_STATUS } = require('../Strings');

const formalStringType = {
  type: String,
  lowercase: true,
};
const uploadsSchema = mongoose.Schema({
  url: formalStringType,
  status: {
    type: String,
    enum: [PROCESS_STATUS.STARTED, PROCESS_STATUS.COMPLETED, PROCESS_STATUS.FAILED, PROCESS_STATUS.STOPPED],
  },
  meta: {
    type: Object,
    default: {},
  },
  message: formalStringType,
  uuid: formalStringType,
  user_id: formalStringType,
  email: formalStringType,
  service: String,
  created_at: { type: Date, default: Date.now },
  bytes_used: Number,
  end_at: { type: Date, default: null },
  unique_id: String,
  type: {
    type: String,
    enum: [PROCESS_TYPE.REMOTE_UPLOAD, PROCESS_TYPE.CLOUD_CLONE, PROCESS_TYPE.TORRENT_TO_DRIVE],
    default: PROCESS_STATUS.REMOTE_UPLOAD,
  },
});
uploadsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('uploads', uploadsSchema);
