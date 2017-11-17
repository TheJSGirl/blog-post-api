const sendResponse = (res, statusCode, data, message) => {
  const status = null;
  const pattern = /^2\d{2}$/;
  // if statusCode starts with 2, set status values as sucess else fail
  pattern.test(statusCode) ? status = 'success' : status = 'failure';

  res.status(statusCode).json({
    data,
    status,
    message,
  });
};

module.exports = sendResponse;
