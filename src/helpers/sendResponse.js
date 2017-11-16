const sendResponse = (res, statusCode, data, message) => {
  
    statusCode === 200 ? 'ok':'failed';
  
    return res.status(statusCode).json({
      data,
      statusCode,
      message
    });
  }
  
  module.exports = sendResponse;