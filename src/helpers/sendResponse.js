const sendResponse = (res, statusCode, data, message) => {
  let status = null;
  const pattern = /^[23]\d{2}$/;
  // if statusCode starts with 2 or 3, set status values as success else fail
  pattern.test(statusCode) ? status = 'success' : status = 'failure';

  res.status(statusCode).json({
    status,    
    data,
    message,
  });
};

module.exports = sendResponse;
