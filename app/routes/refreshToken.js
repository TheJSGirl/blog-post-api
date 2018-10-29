const jwt = require('jsonwebtoken');
const refreshTokenRoute = require('express').Router();
const { sendResponse } = require('../helpers');


refreshTokenRoute.post('/', async (req, res) => {
  try {
    req.check('refreshToken', 'token should be present').exists();

    const errors = req.validationErrors();
    if (errors) {
      return sendResponse(res, 400, [], errors[0].msg);
    }

    const oldRefreshToken = req.body.refreshToken;
    // get the token contents
    const decode = await jwt.verify(oldRefreshToken, process.env.JWT_SECRET_REFRESH);
    delete decode.iat;
    delete decode.exp;
    // generate token
    const token = jwt.sign(
      decode,
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY },
    );

    const refreshToken = jwt.sign(
      decode, process.env.JWT_SECRET_REFRESH,
      { expiresIn: process.env.JWT_EXPIRY_REFRESH },
    );

    res.header('x-auth', token);
    res.header('x-auth-refresh', refreshToken);
    sendResponse(res, 200, { token, refreshToken }, 'Generated new tokens');
  } catch (error) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, 401, [], 'Token Expired');
    }

    if (error.name === 'JsonWebTokenError') {
      return sendResponse(res, 401, [], 'Invalid Token');
    }
    return sendResponse(res, 500, [], 'internal server error');
  }
  return 0;
});

module.exports = refreshTokenRoute;
