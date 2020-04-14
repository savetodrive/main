const SubscriptionPlans = require('../server/core/model/SubscriptionPlans');

const baseDescription = [
  'Share Ratio  3:1',
  'Cloud Clone (Cloud-to-Cloud File Transfer/Sync)',
  'Bulk Upload',
  'Synchronization Modes (Coming Soon)',
  'Torrent To Drive (Coming Soon)'
];
class SubscriptionPlanSeed {
  constructor() {
    this.data = [
      {
        price: 6,
        provider_plan_code: 'basic',
        name: 'Basic',
        description: baseDescription.concat([]),
        billing_cycle_month: 1,
        features: {
          bytes_quota: 6000000
        }
      },
      {
        price: 10,
        provider_plan_code: 'plus',
        name: 'Plus',
        description: baseDescription.concat([]),
        billing_cycle_month: 1,
        features: {
          bytes_quota: 12000000
        }
      },
      {
        price: 15,
        provider_plan_code: 'premium',
        name: 'Premium',
        description: baseDescription.concat([]),
        billing_cycle_month: 1,
        features: {
          bytes_quota: 25000000
        }
      },
      {
        price: 20,
        provider_plan_code: 'max',
        name: 'Max',
        description: baseDescription.concat([]),
        billing_cycle_month: 1,
        features: {
          bytes_quota: 50000000
        }
      }
    ];
  }

  run() {
    return new Promise((resolve, reject) => {
      SubscriptionPlans.collection.insert(this.data, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  }
}

module.exports = SubscriptionPlanSeed;
