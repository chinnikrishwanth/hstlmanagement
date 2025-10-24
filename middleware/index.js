// Middleware index file for easier imports
const { errorHandler, notFound } = require('./errorHandler');
const { validateStudent, validatePayment } = require('./validation');

module.exports = {
  errorHandler,
  notFound,
  validateStudent,
  validatePayment
};
