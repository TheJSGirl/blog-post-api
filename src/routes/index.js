const mainRoute = require('express').Router();
const signUp = require('./signUp');

//middlewares
mainRoute.use('/signUp', signUp);

module.exports = mainRoute;