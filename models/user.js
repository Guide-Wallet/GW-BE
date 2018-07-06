const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  phone: Number,
  occupation: String,
  location: String,
  description: String,
  isRegistered: { type: Boolean, default: true },
  dateJoined: {type: Date, default: Date.now},
  imageUrl: String,
  coverImageUrl: String,
  isAdmin: {type: Boolean, default: false},
})

UserSchema.pre('save', function(next){
  bcrypt.hash(this.password, 10, (err, data) => {
    if(err){
      console.log(err);
      return next(err);
    }
    this.password = data;
    return next()
  })
})

UserSchema.methods.comparePass = function(password, cb){
  bcrypt.compare(password, this.password, cb);
}

module.exports = mongoose.model('User', UserSchema);