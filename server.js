// It's important to load environment variables first
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { validateStudent, validatePayment } = require('./middleware/validation');

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
