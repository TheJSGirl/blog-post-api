const mainRoute = require('express').Router();
const signUp = require('./signUp');
const login = require('./login');
const {checkAuth, isAdmin} = require('../middlewares');
const posts = require('./posts');
const admin = require('./admin');

//middlewares
mainRoute.use('/signUp', signUp);
mainRoute.use('/login', login);
mainRoute.use('/user/', checkAuth, posts);
mainRoute.use('/post/', checkAuth, isAdmin, admin);


module.exports = mainRoute;