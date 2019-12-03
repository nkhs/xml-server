require('./Account');

const mongoose = require('mongoose');

module.exports = {
  Account: mongoose.model('Account')
};