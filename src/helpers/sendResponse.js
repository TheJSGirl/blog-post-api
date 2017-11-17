const sendResponse = (res, statusCode, data, message) => res.status(statusCode).json({
  data,
  message,
});

module.exports = sendResponse;
