const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db.config.js');
const User = require('./models/user.js');

const app = express();
app.use(bodyParser.json());

app.listen(8000, (err, data) => {
  if(err){
    console.log(err);
    return;
  }
  console.log('app running', db);
})

app.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({username, password});
  newUser.save( (err, data) => {
    if(err){
      console.log(err);
      return;
    }
    res.send(data)
  })
});

app.get('/', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  User.findOne({username}, (err, data) => {
    if(err){
      sendStat(err, 400, res)
      return;
    }
    data.comparePass(password, (err, isMatch) => {
      if(err){
        sendStat(err, 400, res)
        return;
      }
      if(isMatch){
        sendStat(`It matched!`, 202, res)
      } else {
        sendStat(`It Doesn't match!`, 404, res)
      }
    })
  })
})

const sendStat = (message, code, res) => {
  console.log(message)
  res.sendStatus(code)
}