const mainRoute = require('express').Router();
const register = require('./register');
const login = require('./login');
const { checkAuth, isAdmin } = require('../middlewares');
const posts = require('./posts');
const admin = require('./admin');
const comments = require('./comments');

// middlewares
mainRoute.use('/register', register);
mainRoute.use('/login', login);
mainRoute.use('/posts', checkAuth, posts);
mainRoute.use('/posts', checkAuth, comments);
mainRoute.use('/admin', checkAuth, isAdmin, admin);

module.exports = mainRoute;
