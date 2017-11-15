const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const expressValidator = require('express-validator');
const routes = require('./routes');
const {port = 3000} = process.env;

//initate app
const app = express();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

//route middleware
app.use('/api', routes);

//listen port
app.listen(port, () => {
  console.log('listening on port no.:', port);
});