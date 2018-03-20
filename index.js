const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db.config.js');


const app = express();
app.use(bodyParser.json());
require('./routes.js')(app)

app.listen(8000)
