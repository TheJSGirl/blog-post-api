const jwt = require('jsonwebtoken');
const sendResponse = require('../helpers/sendResponse');

const checkAuth = asyn(req, res, next) => {
const token = req.header('x-auth');

if(!token || typeof token === undefined){
    return sendResponse(res, 401, [], 'invalid token');
  }

  try{
    //decode token
    const decode = await jwt.verify(token, 'abcdefghklmnop');
    console.log(decode);
  }
  catch(err){

  }
}

module.exports = sendResponse;