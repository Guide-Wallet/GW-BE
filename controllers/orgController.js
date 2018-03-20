const User = require('../models/certification')
const Cert = require('../models/certification')

const issueCert = (req, res) => {
  const { userInfo } = req
  const { name, description, userId, expires } = req.body
  const cert = new Cert({ name, description, userId, expires, organizationId: userInfo.id });
  cert.save()
      .then( data => {
        res.sendStatus(200)
        return;
      })
      .catch( err => {
        console.log(err);
        res.sendStatus(500);
      })
}

module.exports = {
  issueCert
}