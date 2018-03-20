const userController = require('./controllers/userController')
const loginSignupController = require('./controllers/loginSignupController')
const orgController = require('./controllers/orgController')
const { setUser, setOrg } = require('./middleware')
const { validateToken } = require('./helpers/auth')

module.exports = (app) => {
  /* User routes */
  app.post('/user/signup', loginSignupController.userSignUp)
  app.put('/user/login', setUser, loginSignupController.login)
  app.get('/user/certs', validateToken, userController.getUserCerts)

  /* Org routes */
  app.post('/org/signup', loginSignupController.orgSignUp)
  app.put('/org/login', setOrg, loginSignupController.login)
  app.post('/org/issue', validateToken, orgController.issueCert)
}