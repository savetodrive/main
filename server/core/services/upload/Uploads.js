const startOfMonth = require('date-fns/start_of_month');
const endOfMonth = require('date-fns/end_of_month');
const UploadModel = require('../../model/Upload');

class Uploads {
  async getBytesUsedInMonth(userId) {
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());
    const uploads = await UploadModel.find({ user_id: userId, created_at: { $gte: startDate, $lte: endDate } }, 'bytes_used');
    return uploads.reduce((sum, { bytes_used }) => {
      const s = sum + parseFloat(bytes_used || 0, 10);
      return s;
    }, 0);
  }

  static paginate({ userId, page = 1, limit = 10 }) {
    return UploadModel.paginate({ user_id: userId }, { page, limit });
  }
}

module.exports = Uploads;
