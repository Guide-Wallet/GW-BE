const server = require('express')
const router = server.Router()

const {
  validateEmail, 
  validatePhone, 
  orgSignUp, 
  login, 
  getSignedUrl
} = require('../controllers/loginSignupController')
        
const { 
  createCourse, 
  getCourses, 
  updateCourse, 
  issueCerts, 
  findUsersByEmail, 
  deleteCourse, 
  getCerts,
  revokeCert,
  reinstateCert 
} = require('../controllers/orgController')
const { setOrg } = require('../middleware')
const { validateToken } = require('../helpers/auth')


router.put('/validateEmail', setOrg, validateEmail)
router.put('/validatePhone', setOrg, validatePhone)
router.post('/signup', orgSignUp)
router.put('/login', setOrg, login)
router.post('/createCourse', validateToken, createCourse)
router.get('/getCourses', validateToken, getCourses)
router.post('/issueCerts', validateToken, issueCerts)
router.get('/getSignedUrl', validateToken, setOrg, getSignedUrl)
router.put('/getUsersByEmail', validateToken, findUsersByEmail)
router.delete('/course/:id', validateToken, deleteCourse )
router.put('/course/:id', validateToken, updateCourse, createCourse )
router.get('/certs', validateToken, getCerts)
router.put('/certs/revoke', validateToken, revokeCert)
router.put('/certs/reinstate', validateToken, reinstateCert)

module.exports = router