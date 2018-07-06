const User = require('../models/user')
const Certs = require('../models/certification')

const getUserCerts = async (req, res) => {
  const { userInfo } = req
  try {
    const certs = await Certs.find({userId: userInfo.id})
      .populate('organizationId', 'orgName logoUrl')
      .populate('userId', '-password')
      .populate('courseId')
    res.status(202).json(certs)
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
}

const findUserByEmail = (email) => {
  User.findOne({email: { $regex: email, $options: 'i'}})
    .then( data => data )
    .catch( err => console.log(error))
}

const findUserByPhone = (phone) => {
  User.findOne({phone})
    .then( data => data )
    .catch( err => console.log(error))
}

const updateUser = async (req, res) => {
  const { userInfo } = req;
  try {
    const user = await User.findByIdAndUpdate(userInfo.id, req.body, {new: true})
    console.log("AM I HERE?", user)
    res.status(201).json({user})
  } catch(err) {a
    res.sendStatus(500)
  }
}

const getProfile = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({username}).select('firstName lastName location occupation description imageUrl')
    const certs = await Certs.find({userId: user._id}).populate('organizationId', 'orgName imageUrl').populate('courseId')
    res.status(200).json({user: Object.assign({}, user._doc, {certs})})
  } catch(err) {
    console.log(err)
  }
}
module.exports = {
  getUserCerts,
  findUserByEmail,
  findUserByPhone,
  updateUser,
  getProfile
}