const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CertificationSchema = new Schema({
  name: { type: String, required: true},
  description: { type: String, required: true},
  organizationId: { type: ObjectId, ref: 'Organization' },
  userId: { type: ObjectId, ref: 'User' },
  expires: Date,
  isRevoked: Boolean,
  isRemoved: Boolean
})

// CertificationSchema.post('find', (err, data) => {
//   data.populate({organizationId})
//   next();
// })

module.exports = mongoose.model('Certification', CertificationSchema)