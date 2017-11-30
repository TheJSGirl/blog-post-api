const jwt = require('jsonwebtoken');
const refreshTokenRoute = require('express').Router();
const { sendResponse } = require('../helpers');


refreshTokenRoute.post('/refresh', async (req, res) => {
  try {
    req.check('token', 'token should be present').exists().isInt().optional();

    const errors = req.validationErrors();
    if (errors) {
      return sendResponse(res, 400, [], errors[0].msg);
    }

    const { token } = req.body;
    // get the token contents
    const decode = await jwt.verify(token, process.env.JWT_SECRET);

    // generate token
    const newToken = jwt.sign(
      decode,
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY },
    );

    const refreshToken = jwt.sign(
      decode, process.env.JWT_SECRET_REFRESH,
      { expiresIn: process.env.JWT_EXPIRY_REFRESH },
    );

    res.header('x-auth', token);
    res.header('x-auth-refresh', refreshToken);
    sendResponse(res, 200, { newToken, refreshToken }, 'Generated new token');
  } catch (error) {
    return sendResponse(res, 500, [], 'internal server error');
  }
  return 0;
});

module.exports = refreshTokenRoute;
