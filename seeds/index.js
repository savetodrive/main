require('dotenv').config();
const appConfig = require('../config/app');
const path = require('path');

global.config = () => appConfig;
global.Promsie = Promise;

global.db = require('../server/core/database/mongo');

const seeds = {
  SubscriptionPlan: 'SubscriptionPlan.js'
};

const promises = Object.keys(seeds).map((seed) => {
  const Item = require(path.join(__dirname, seed));
  return new Item().run().catch((err) => {
    console.error(`Problem occurred while seeding ${seed}`);
  });
});

Promise.all(promises)
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });
