const server = require('express')
const router = server.Router()
const { getUserCerts, updateUser, getProfile } = require('../controllers/userController')
const { 
  validateEmail, 
  validatePhone, 
  validateUsername, 
  userSignUp, 
  login, 
  getSignedUrl
} = require('../controllers/loginSignupController')
const { setUser } = require('../middleware')
const { validateToken } = require('../helpers/auth')

router.put('/validateEmail', setUser, validateEmail)
router.put('/validatePhone', setUser, validatePhone)
router.put('/validateUsername', validateUsername)
router.post('/signup', userSignUp)
router.put('/login', setUser, login)
router.put('/update', validateToken, updateUser)
router.get('/certs', validateToken, getUserCerts)
router.get('/profile', getProfile)
router.get('/getSignedUrl', validateToken, setUser, getSignedUrl)

module.exports = router