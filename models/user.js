const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  firstName: String,
  lastName: String,
  phone: Number,
  dateJoined: {type: Date, default: Date.now},
  certifications: Array,
  photoUrl: String,
  isAdmin: {type: Boolean, default: false},
})

UserSchema.pre('save', function(next){
  bcrypt.hash(this.password, 10, (err, data) => {
    if(err){
      console.log(err);
      return
    }
    this.password = data;
    next()
  })
})

UserSchema.methods.comparePass = function(password, cb){
  bcrypt.compare(password, this.password, cb);
}

module.exports = mongoose.model('User', UserSchema);