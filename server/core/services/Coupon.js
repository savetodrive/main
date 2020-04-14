const CouponsModel = require('../model/Coupons');

class Coupon {
  constructor(couponCode) {
    this.couponCode = couponCode;
    this.coupon = null;
  }
  async get() {
    if (this.coupon) {
      return this.coupon;
    }
    this.coupon = await Coupon.find({
      code: this.couponCode,
    });
    return this.coupon;
  }
  assignToUser(userId) {
    return CouponsModel.update(
      {
        code: this.couponCode,
      },
      { user_id: userId },
    );
  }
  static async find(clause) {
    const coupon = await CouponsModel.findOne(clause);
    return coupon;
  }

  static generate({ startsAt, expiresAt, counts = 10 }) {
    const coupons = Array(counts)
      .fill(true)
      .map(() => ({
        starts_at: startsAt,
        expires_at: expiresAt,
      }));
    return CouponsModel.insertMany(coupons);
  }
}

module.exports = Coupon;
