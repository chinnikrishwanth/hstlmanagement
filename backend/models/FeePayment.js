const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: { type: String, enum: ['cash', 'online', 'card'], required: true },
  status: { type: String, enum: ['paid', 'pending'], default: 'paid' }
}, { timestamps: true });

module.exports = mongoose.model('FeePayment', feePaymentSchema);
