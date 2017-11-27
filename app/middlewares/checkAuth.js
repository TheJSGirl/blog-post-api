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
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    // validate if token expired
    if (err.name === 'TokenExpiredError') {
      return sendResponse(res, 401, [], 'Token Expired');
    }
    
    if (err.name === 'JsonWebTokenError') {
      return sendResponse(res, 401, [], 'Invalid Token');
    }
    return sendResponse(res, 500, [], 'Something went wrong');
  }
};

module.exports = checkAuth;
