const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = mongoose.connect('mongodb://localhost/guide-wallet');

module.exports = db;