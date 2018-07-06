const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/certstash');

const orgRoutes = require('./views/orgRoutes')
const userRoutes = require('./views/userRoutes')

const port = 8000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log("SERVER LISTENING ON PORT:", port)
})

app.use('/org', orgRoutes)
app.use('/user', userRoutes)
