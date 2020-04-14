/* eslint-disable */
const rules = require('../../../../src/Utils/ValidationRules');

module.exports = Object.assign(rules, {
  publicUpload: {
    url: 'required|url',
    filename: 'required_with:isFilename',
    email: 'required_with:isEmail|email',
    isEmail: 'boolean',
    isFilename: 'boolean'
  }
});
