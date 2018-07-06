const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const OrganizationSchema = new Schema({
  password: {type: String, required: true},
  email: {type: String, required: true},
  orgName: {type: String, required: true},
  phone: Number,
  dateJoined: {type: Date, default: Date.now},
  location: String,
  description: String,
  imageUrl: String,
  coverImageUrl: String,
  courses: [{type: ObjectId, ref: 'Course'}]
})

OrganizationSchema.pre('save', function(next){
  bcrypt.hash(this.password, 10, (err, data) => {
    if(err){
      console.log(err);
      return
    }
    this.password = data;
    next()
  })
})

OrganizationSchema.methods.comparePass = function(password, cb){
  bcrypt.compare(password, this.password, cb);
}

module.exports = mongoose.model('Organization', OrganizationSchema);