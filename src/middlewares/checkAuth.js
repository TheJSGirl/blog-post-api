const jwt = require('jsonwebtoken');
const sendResponse = require('../helpers/sendResponse');

const checkAuth = async (req, res, next) => {
  const token = req.header('x-auth');

  // validate if token is empty of undefined
  if (!token || typeof token === undefined) {
    return sendResponse(res, 401, [], 'invalid token');
  }

  try {
    // decode token
    const decode = await jwt.verify(token, 'abcdefghijklmnop');
    console.log(decode);
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    // validate if token expired
    if (err.name === 'TokenExpiredError') {
      return sendResponse(res, 401, [], 'token expired');
    }
    return sendResponse(res, 500, [], 'something went wrong');
  }
};

module.exports = checkAuth;
