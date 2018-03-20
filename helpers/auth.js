const { JWTsecret } = require('../config.js')
const jwt = require('jsonwebtoken')

const validateToken = (req, res, next) => {
  const token = req.get('Authorization')
  jwt.verify(token, JWTsecret, (err, decoded) => {
    if(err){
      console.log(err)
      res.sendStatus(401)
      return;
    }
    req.userInfo = decoded
    next();
  })
}

module.exports = {
  validateToken
}