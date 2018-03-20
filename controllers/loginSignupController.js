const User = require('../models/user.js')
const Org = require('../models/organization.js')
const jwt = require('jsonwebtoken')
const { JWTsecret } = require('../config.js')

const createToken = (user) => {
  const userInfo = {
    username: user.username,
    isAdmin: user.isAdmin,
    id: user._id
  }
  const token = jwt.sign(userInfo, JWTsecret);
  return token;
}

const userSignUp = (req, res) => {
  const {username, password, email, firstName, lastName, phone, photoUrl, isAdmin} = req.body;
  const userInfo = {username, password, email, firstName, lastName, phone, photoUrl, isAdmin}
  const newUser = new User(userInfo);
  newUser.save( (err, user) => {
    if(err){
      console.log(err);
      return;
    }
    const token = createToken(newUser)
    res.status(202).json({user: newUser, token})
  })
}

const orgSignUp = (req, res) => {
  const {username, password, email, orgName, phone, logoUrl} = req.body;
  const orgInfo = {username, password, email, orgName, phone, logoUrl}
  const newOrg = new Org(orgInfo);
  newOrg.save( (err, org) => {
    if(err){
      console.log(err);
      return;
    }
    const token = createToken(newOrg)
    res.status(202).json({org: newOrg, token})
  })
}

// This function will take either a User or Org and sign them in.
const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const Model = req.model;
  Model.findOne({username}, (err, user) => {
    if(err){
      res.sendStatus(404)
      return;
    }
    user.comparePass(password, (err, isMatch) => {
      if(err){
        res.sendStatus(500)
        return;
      }
      if(isMatch){
        const token = createToken(user)
        res.status(200).json({user, token});
        return;
      } else {
        res.sendStatus(401)
        return;
      }
    })
  })
}

module.exports = {
  userSignUp,
  orgSignUp,
  login,
}