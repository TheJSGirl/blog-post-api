const { sendResponse } = require('../helpers');

const isAdmin = (req, res, next) => {
  // check authentication
  if (!req.user) {
    return sendResponse(res, 405, [], 'failed');
  }
  // check user is admin or not
  if (req.user.userType !== 1) {
    return sendResponse(res, 400, [], 'user not authorised');
  }
  return next();
};

module.exports = isAdmin;
