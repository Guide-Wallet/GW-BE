const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
  middleInitial: String,
  dateJoined:  new Date(),
  currentEmployer: String,
})

UserSchema.pre('save', function(next){
  bcrypt.hash(this.password, 10, (err, data) => {
    if(err){
      console.log(err);
      return
    }
    this.password = data
    next()
  })
})

UserSchema.methods.comparePass = function(password, cb){
  bcrypt.compare(password, this.password, cb);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;

