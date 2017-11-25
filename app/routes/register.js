const signUp = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const sendResponse = require('../helpers/sendResponse');
cosnt jwt = require('jsonwebtoken');


signUp.route('/').post(async (req, res) => {
  try {
    // validate by using express-validator
    req.check('username', 'username is required/ minimum 5 characters').exists().isLength({ min: 5 });
    req.check('email', 'invalid email').exists().isEmail();
    req.check('password', 'too short password/ minimum 5 characters').exists().isLength({ min: 5 });

    const errors = req.validationErrors();
    if (errors) {
      return sendResponse(res, 400, [], errors[0].msg);
    }

    const { username, email, password } = req.body;


    const hashedPassword = await bcrypt.hash(password, 10);
    const userDetail = {
      username,
      email,
      password: hashedPassword,
    };

    const [newUser] = await pool.query('INSERT INTO users SET ? ', userDetail);

    const userDetail = {
      userId: newUser.insertId,
      userType: 0
    }

    //generate token
    const token = jwt.sign(userDetail, process.env.JWT_SECRET, { expiredIn: process.env.JWT_EXPIRY _});
    //set token in response headers
    res.header('x-auth', token);
    
    return sendResponse(res, 200, { token }, 'Registration successful');

  
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return sendResponse(res, 409, [], 'email/username already exist');
    }
    return sendResponse(res, 500, [], 'failed', 'something went wrong');
  }
});

module.exports = signUp;
