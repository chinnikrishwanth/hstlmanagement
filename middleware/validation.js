// Validation middleware for student data
const validateStudent = (req, res, next) => {
  const { name, email, phone, address, roomNumber, guardianName, guardianPhone, monthlyFee } = req.body;
  
  const errors = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }
  
  if (!phone || phone.trim().length === 0) {
    errors.push('Phone number is required');
  }
  
  if (!address || address.trim().length === 0) {
    errors.push('Address is required');
  }
  
  if (!roomNumber || roomNumber.trim().length === 0) {
    errors.push('Room number is required');
  }
  
  if (!guardianName || guardianName.trim().length === 0) {
    errors.push('Guardian name is required');
  }
  
  if (!guardianPhone || guardianPhone.trim().length === 0) {
    errors.push('Guardian phone is required');
  }
  
  if (!monthlyFee || isNaN(monthlyFee) || monthlyFee <= 0) {
    errors.push('Valid monthly fee is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  
  next();
};

// Validation middleware for payment data
const validatePayment = (req, res, next) => {
  const { studentId, month, year, amount, paymentMode } = req.body;
  
  const errors = [];
  
  if (!studentId) {
    errors.push('Student ID is required');
  }
  
  if (!month || month.trim().length === 0) {
    errors.push('Month is required');
  }
  
  if (!year || isNaN(year) || year < 2020 || year > 2030) {
    errors.push('Valid year is required');
  }
  
  if (!amount || isNaN(amount) || amount <= 0) {
    errors.push('Valid amount is required');
  }
  
  if (!paymentMode || !['cash', 'online', 'card'].includes(paymentMode)) {
    errors.push('Valid payment mode is required (cash, online, card)');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  
  next();
};

module.exports = {
  validateStudent,
  validatePayment
};
