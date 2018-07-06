const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CertificationSchema = new Schema({
  organizationId: { type: ObjectId, ref: 'Organization', required: true },
  instructor: String,
  courseId: { type: ObjectId, ref: 'Course', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  expires: Date,
  isRevoked: { type: Boolean, default: false },
  isRemoved: { type: Boolean, default: false }
}, {
  timestamps: true
})

module.exports = mongoose.model('Certification', CertificationSchema)