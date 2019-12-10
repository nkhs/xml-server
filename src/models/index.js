require('./Account');
require('./Ad');

const mongoose = require('mongoose');

module.exports = {
  Account: mongoose.model('Account'),
  Ad: mongoose.model('Ad'),
  
};