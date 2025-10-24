const FeePayment = require('../models/FeePayment');

// Get all fee payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await FeePayment.find()
      .populate('studentId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get payments for a specific student
const getPaymentsByStudent = async (req, res) => {
  try {
    const payments = await FeePayment.find({ studentId: req.params.studentId })
      .sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add fee payment
const createPayment = async (req, res) => {
  const payment = new FeePayment(req.body);
  try {
    const newPayment = await payment.save();
    const populatedPayment = await FeePayment.findById(newPayment._id).populate('studentId');
    res.status(201).json(populatedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllPayments,
  getPaymentsByStudent,
  createPayment
};
