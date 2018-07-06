const Org = require('../models/organization')
const User = require('../models/user')
const Cert = require('../models/certification')
const Course = require('../models/course')
const moment = require('moment')

const issueCerts = async (req, res) => {
  const { userInfo } = req
  // users is an array of User objects, course is the object of the course being issued
  const { users, course, instructor } = req.body

  // get the amount and type from validAmount field (if exists)
  const validAmount = course && course.validDuration && course.validDuration.amount
  const validType = course && course.validDuration && course.validDuration.type

  // create new expiration date ussing current date and time specified.
  const expirationDate = moment().add(validAmount, validType)

  // create error and data variables for use in our async function
  let error;
  let data = []

  // function will asyncronously iterate through users array creating a new certificate for each. 
  for(let i = 0; i < users.length; i++){
    let cert = new Cert({
      userId: users[i]._id,
      instructor,
      organizationId: userInfo.id,
      courseId: course._id,
      expires: expirationDate
    })
    try {
      data.push(await cert.save())
    } catch (err) {
      error = err
    }
  }

  //Once function is through iterating, return either the error, or the status successful.
  if(error){
    res.status(500).send({error})
  } else {
    res.sendStatus(201)
  }
}

const revokeCert = ( req, res ) => {
  const { id } = req.body;
  Cert.findByIdAndUpdate(id, {isRevoked: true})
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500))
}

const reinstateCert = ( req, res ) => {
  const { id } = req.body;
  Cert.findByIdAndUpdate(id, {isRevoked: false})
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500))
}

const createCourse = (req, res) => {
  const { userInfo } = req
  const { name, description, validDuration } = req.body
  const course = new Course({ name, description, validDuration, organizationId: userInfo.id });
  course.save()
    .then( data => {
      return Org.findOne({_id: userInfo.id}).then(data => {
        let arr = [...data.courses, course._id]
        data.update({courses: arr}).then(
          Promise.resolve()
        )
      })
    })
    .then( data => {
      res.sendStatus(200)
      return;
    })
    .catch( err => {
      console.log(err);
      res.sendStatus(500);
    })
}

const getCourses = (req, res) => {
  const { userInfo } = req
  Org.findOne({_id: userInfo.id})
    .populate('courses')
    .exec( (err, data) => {
      if(err){
        return res.sendStatus(500);
      } else if (data === null){
        return res.sendStatus(404);
      } else {
        res.status(200).send(data.courses)
      }
    })
}

// updateCourse will find the old course id and set the isValid flag to false. It will then invike the next function/
// Next, createCourse will be called and a new course will be created. This allows students with previous course certifications 
// to not break when the course is updated. 
const updateCourse = async ( req, res, next ) => {
  const { id } = req.params;
  try {
    const data = await Course.findOneAndUpdate( { _id: id }, { isValid: false } )
    if(data === 0){
      res.sendStatus(404);
      return
    }
    next()
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
}

// Delete course will update the course with the isValid flag as false. This allows students with previous course certifications 
// to continue having those certs and not break when the course is updated. 
const deleteCourse = async ( req, res ) => {
  const { id } = req.params;
  try {
    const data = await Course.findOneAndUpdate( { _id: id }, { isValid: false } )
    if(data === 0){
      res.sendStatus(404);
      return
    } else {
      res.sendStatus(204)
    }
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
}

const findUsersByEmail = async ( req, res ) => {
  const { users } = req.body
  try {
    const user = await User.find({email: { $in: users.map( user => new RegExp(user, 'i')) }})
    res.status(200).send(user)
  } catch( err ){
    res.sendStatus(500)
    console.log(err)
  }
}

const getCerts = async ( req, res ) => {
  const { id } = req.userInfo;
  const { course, startdate, enddate, email } = req.query;
  try {
    let certs = Cert.find({organizationId: id})
    certs.populate('userId','-password')
    certs.populate('courseId')

    if(course !== undefined){
      certs.where({courseId: course})
    }
    if(startdate !== undefined){
      certs.where('createdAt').gte(startdate)
    }
    if(enddate !== undefined){
      certs.where('createdAt').lte(enddate)
    }
    certs = await certs.exec()

    if(email !== undefined){
      certs = certs.filter( cert => {
        const filter = new RegExp(email, 'i')
        return cert.userId.email.match(filter)
      })
    }
    
    res.status(200).json(certs);
  } catch(err) {
    console.log(err)
    res.status(500).json(err);
  }
}

module.exports = {
  issueCerts,
  createCourse,
  getCourses,
  findUsersByEmail,
  updateCourse,
  deleteCourse,
  getCerts,
  revokeCert,
  reinstateCert
}