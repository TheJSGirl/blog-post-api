const mainRoute = require('express').Router();
const signUp = require('./signUp');
const login = require('./login');

//middlewares
mainRoute.use('/signUp', signUp);
mainRoute.use('/login', login);


module.exports = mainRoute;