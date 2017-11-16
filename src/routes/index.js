const mainRoute = require('express').Router();
const signUp = require('./signUp');
const login = require('./login');
const {checkAuth} = require('../middlewares');
const posts = require('./posts');

//middlewares
mainRoute.use('/signUp', signUp);
mainRoute.use('/login', login);
mainRoute.use('/user/', checkAuth, posts);


module.exports = mainRoute;