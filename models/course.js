const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CourseSchema = new Schema({
  name: String,
  description: { type: String, required: true},
  organizationId: { type: ObjectId, ref: 'Organization' },
  validDuration: Object,
  isValid: { type: Boolean, default: true }
})


module.exports = mongoose.model('Course', CourseSchema)