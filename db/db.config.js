const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost/guide-wallet', (err, data) => {
  if(err){
    console.log(err)
    return
  }

  console.log('connected to database');
})

module.exports = db;