
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  roomNumber: { type: String, required: true },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
  monthlyFee: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// Fee Payment Schema
const feePaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: { type: String, enum: ['cash', 'online', 'card'], required: true },
  status: { type: String, enum: ['paid', 'pending'], default: 'paid' }
}, { timestamps: true });

const FeePayment = mongoose.model('FeePayment', feePaymentSchema);

// Routes

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single student
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/students', async (req, res) => {
  const student = new Student(req.body);
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/payments', async (req, res) => {
  try {
    const payments = await FeePayment.find()
      .populate('studentId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/payments/student/:studentId', async (req, res) => {
  try {
    const payments = await FeePayment.find({ studentId: req.params.studentId })
      .sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post('/api/payments', async (req, res) => {
  const payment = new FeePayment(req.body);
  try {
    const newPayment = await payment.save();
    const populatedPayment = await FeePayment.findById(newPayment._id).populate('studentId');
    res.status(201).json(populatedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.get('/api/rooms/available', async (req, res) => {
  try {
    const occupiedRooms = await Student.find({ status: 'active' }).distinct('roomNumber');
    const allRooms = Array.from({ length: 50 }, (_, i) => `R${(i + 1).toString().padStart(3, '0')}`);
    const availableRooms = allRooms.filter(room => !occupiedRooms.includes(room));
    res.json(availableRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
