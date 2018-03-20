const User = require('./models/user.js')
const Org = require('./models/organization.js')

const setUser = (req, res, next) => {
  req.model = User;
  next();
}

const setOrg = (req, res, next) => {
  req.model = Org;
  next();
}

module.exports = {
  setUser,
  setOrg
}