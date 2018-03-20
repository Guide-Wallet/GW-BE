const User = require('../models/certification')
const Certs = require('../models/certification')

const getUserCerts = (req, res) => {
  const { userInfo } = req
  Certs.find({userId: userInfo.id})
       .populate('organizationId', 'orgName logoUrl')
       .exec()
       .then( data => {
         console.log("data", data)
         res.status(202).json(data)
       })
       .catch( err => {
         console.log(err);
         res.sendStatus(500);
       }) 
}
module.exports = {
  getUserCerts
}