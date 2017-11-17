const login = require('express').Router();
const pool = require('../db');
const sendResponse = require('../helpers/sendResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

login.route('/')
  .post(async (req, res) => {
    // validate userName and password
    req.check('userName', 'userName require/min 5 chars long').exists().isLength({ min: 5 });
    req.check('password', 'too short password').exists().isLength({ min: 5 });

    const errors = req.validationErrors();
    if (errors) {
      return sendResponse(res, 400, [], errors[0].msg);
    }

    // get userName and password from req.body by destructuring
    const { userName, password } = req.body;

    try {
      const [result] = await pool.query(`SELECT id, password, userType FROM users where userName = '${userName}'`);

      const passwordFromDb = result[0].password;

      // console.log(passwordFromDb);
      const isValidPassword = await bcrypt.compare(password, passwordFromDb);

      if (!isValidPassword) {
        return sendResponse(res, 401, [], 'Unauthorised');
      }

      const userDetailForToken = {
        userId: result[0].id,
        userType: result[0].userType,
      };

      // generate token
      const token = jwt.sign(userDetailForToken, 'abcdefghijklmnop', { expiresIn: 60 * 60 });
      // console.log('your token is:', token);

      // return res.header('x-auth', token).status(200).json({
      //   status: 'ok',
      //   message: 'welcome'
      // });
      res.header('x-auth', token);
      return sendResponse(res, 200, { token }, 'login successful');
    } catch (err) {
      console.error(err);
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        return sendResponse(res, 400, [], 'bad request');
      }
      return sendResponse(res, 500, [], 'something went wrong');
    }
  });


module.exports = login;
