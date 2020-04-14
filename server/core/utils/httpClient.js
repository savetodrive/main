const axios = require('axios');

// const HOST = process.env.NODE_ENV === 'development'
//  ? 'http://localhost:3001'
//  : 'http://localhost:3000';
const validateStatus = function validateStatus(status) {
  return status >= 200 && status <= 299; // default
};
module.exports = {
  simple: axios.create({
    validateStatus,
  }),
  auth: function api(accessToken) {
    return axios.create({
      headers: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      validateStatus,
    });
  },
};
