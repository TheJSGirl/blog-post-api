const mainRoute = require('express').Router();
const register = require('./register');
const login = require('./login');
const {checkAuth, isAdmin} = require('../middlewares');
const posts = require('./posts');
const admin = require('./admin');
const comments = require('./comments');

//middlewares
mainRoute.use('/register', register);
mainRoute.use('/login', login);
mainRoute.use('/users/', checkAuth, posts);
mainRoute.use('/posts/', checkAuth, isAdmin, admin);
mainRoute.use('/comments', checkAuth,isAdmin, comments);


module.exports = mainRoute;