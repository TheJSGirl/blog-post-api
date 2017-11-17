const signUp = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const sendResponse = require('../helpers/sendResponse');


signUp.route('/').post(async (req, res) => {
  try {
    // validate by using express-validator
    req.check('userName', 'must required userName').exists().isLength({ min: 5 });
    req.check('email', 'invalid email').exists().isEmail();
    req.check('password', 'too short password').exists().isLength({ min: 5 });

    const errors = req.validationErrors();
    if (errors) {
      return sendResponse(res, 400, [], errors[0].msg);
    }

    const { userName, email, password } = req.body;


    const hashedPassword = await bcrypt.hash(password, 10);
    const userDetail = {
      userName,
      email,
      password: hashedPassword,
    };

    await pool.query('INSERT INTO users SET ? ', userDetail);
    return sendResponse(res, 200, [], 'Registration successful, please go to /login');
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return sendResponse(res, 409, [], 'email/username already exist');
    }
    return sendResponse(res, 500, [], 'failed', 'something went wrong');
  }
});

module.exports = signUp;
