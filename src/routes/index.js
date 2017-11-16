const mainRoute = require('express').Router();
const signUp = require('./signUp');
const login = require('./login');
const {checkAuth} = require('../middlewares');

//middlewares
mainRoute.use('/signUp', signUp);
mainRoute.use('/login', login);


module.exports = mainRoute;