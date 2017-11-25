const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const expressValidator = require('express-validator');
const routes = require('./routes');

const port = process.env.PORT || 3000;

// initiate app
const app = express();

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use((req, res, next) => {
  // Expose the custom headers so that browser can allow to use it
  res.setHeader('Access-Control-Expose-Headers','X-Powered-By, X-Auth');
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'successful',
    data: {
      register: 'Go to /register',
      login: 'Go to /login',
      api_docs: 'Find the api docs here: https://github.com/TheJSGirl/Blogging-app',
    },
    message: 'Welcome to blog-post-api',
  });
});
// route middleware
app.use('/api', routes);

// listen port
app.listen(port, () => {
  console.log('listening on port no.:', port);
});
