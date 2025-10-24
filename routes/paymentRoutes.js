const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getPaymentsByStudent,
  createPayment
} = require('../controllers/paymentController');
const { validatePayment } = require('../middleware/validation');

// Payment routes
router.get('/', getAllPayments);
router.get('/student/:studentId', getPaymentsByStudent);
router.post('/', validatePayment, createPayment);

module.exports = router;
