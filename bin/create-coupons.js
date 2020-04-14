#!/usr/bin/env node
require('dotenv').config();
const argv = require('yargs').argv;
const appConfig = require('../config/app');
const addDays = require('date-fns/add_days');
const path = require('path');
const yargs = require('yargs');

global.config = () => appConfig;
global.Promsie = Promise;
global.logger = { info: console.log, error: console.error };

global.db = require('../server/core/database/mongo');
const Coupons = require('../server/core/services/Coupon');
// npm run create:coupons -- --count=12 --starts=1 --expires=12
// -- count = Number of coupons to create
// -- starts = From when coupon will be effective in days
// -- expires == From when coupon won't work , counts from starts in days
global.db.connect().then(() => {
  const counts = argv.counts;
  const starts = addDays(new Date(), argv.starts || 0);
  const expires = addDays(starts, argv.expires);
  Coupons.generate({
    counts,
    startsAt: starts,
    expiresAt: expires,
  })
    .then((coupons) => {
      console.log(coupons);
      process.exit(0);
    })
    .catch((err) => {
      throw err;
    });
});
