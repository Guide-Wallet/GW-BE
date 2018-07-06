const User = require('../models/user.js')
const Org = require('../models/organization.js')
const jwt = require('jsonwebtoken')
const { JWTsecret, AWS_CREDS } = require('../config.js')

const AWS = require('aws-sdk')
const S3_BUCKET = 'certstash'
const awscreds = AWS.config.update(AWS_CREDS);
const s3 = new AWS.S3();


const createToken = (user) => {
  const userInfo = {
    email: user.email,
    isAdmin: user.isAdmin,
    id: user._id
  }
  const token = jwt.sign(userInfo, JWTsecret);
  return token;
}

const validateEmail = (req, res) => {
  const Model = req.model;
  const { email } = req.body;
  Model.find({email})
    .then( user => {
      let inUse;
      if(user.length > 0){
        inUse = true
      } else {
        inUse = false
      }
      res.status(200).json({inUse})
    })
    .catch( err => {
      console.log(err);
      res.sendStatus(400);
    })
}

const getSignedUrl = (req, res) => {
  const Model = req.model
  const fileExtension = req.query['file-name'].split('.')
  const fileName = req.userInfo.id + '.' + fileExtension[fileExtension.length - 1];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 15,
    ContentType: fileType,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, ( err, data ) => {
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    Model.update({ _id: req.userInfo.id }, { imageUrl: returnData.url }, ( err, data ) => { 
      if(err){
        console.log(err)
        res.sendStatus(500)
      }else{
        res.status(200).json(returnData)
      }
    })
  })
}

const validatePhone = (req, res) => {
  const Model = req.model;
  const { phone } = req.body;
  Model.find({phone})
    .then( user => {
      let inUse;
      
      if(user.length > 0){
        inUse = true
      } else {
        inUse = false
      }
      res.status(200).json({inUse})
    })
    .catch( err => {
      console.log(err);
      res.sendStatus(500);
    })
}

const validateUsername = ( req, res ) => {
  const { username } = req.body;
  User.find({username})
    .then( user => {
      let inUse;
      if(user.length > 0){
        inUse = true
      } else {
        inUse = false
      }
      res.status(200).json({inUse})
    })
    .catch( err => {
      console.log(err);
      res.sendStatus(500);
    })
}

const userSignUp = (req, res) => {
  const userInfo = req.body
  const newUser = new User(userInfo);
  newUser.save( (err, user) => {
    if(err){
      console.log(err);
      res.sendStatus(400);
      return;
    }
    const token = createToken(newUser)
    res.status(202).json({user: newUser, token})
  })
}

const orgSignUp = (req, res) => {
  const {password, email, orgName, phone, logoUrl} = req.body;
  const orgInfo = {password, email, orgName, phone, logoUrl}
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
  const email = req.body.email;
  const password = req.body.password;
  const Model = req.model;
  Model.findOne({email}, (err, user) => {
    if(err || user === null){
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
  validateEmail,
  validatePhone,
  validateUsername,
  userSignUp,
  orgSignUp,
  login,
  getSignedUrl
}