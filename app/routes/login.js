const login = require('express').Router();
const pool = require('../db');
const sendResponse = require('../helpers/sendResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

login.route('/')
  .post(async (req, res) => {
    // validate username and password
    req.check('username', 'username require/min 5 chars long').exists().isLength({ min: 5 });
    req.check('password', 'too short password').exists().isLength({ min: 5 });

    const errors = req.validationErrors();
    if (errors) {
      return sendResponse(res, 400, [], errors[0].msg);
    }

    // get username and password from req.body by destructuring
    const { username, password } = req.body;

    try {
      const [result] = await pool.query(`SELECT id, password, userType FROM users where username = '${username}'`);

      if (result.length === 0) {
        return sendResponse(res, 404, [], 'Username not registered');
      }
      const passwordFromDb = result[0].password;

      // console.log(passwordFromDb);
      const isValidPassword = await bcrypt.compare(password, passwordFromDb);

      if (!isValidPassword) {
        return sendResponse(res, 401, [], 'Failed to authenticate, error in username/password');
      }

      const userDetailForToken = {
        userId: result[0].id,
        userType: result[0].userType,
      };

      // generate token
      const token = jwt.sign(userDetailForToken,
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY },
      );

      const refreshToken = jwt.sign(
        userDetailForToken, process.env.JWT_SECRET_REFRESH,
        { expiresIn: process.env.JWT_EXPIRY_REFRESH },
      );

      // set token in response header
      res.header('x-auth', token);
      res.header('x-auth-refresh', refreshToken);
      // also send token in response body
      return sendResponse(res, 200, { token, refreshToken }, 'Login successful');
    } catch (err) {
      console.error(err);
      return sendResponse(res, 500, [], 'something went wrong');
    }
  });


module.exports = login;
