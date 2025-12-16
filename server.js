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

// Root route - ADD THIS
app.get('/', (req, res) => {
  res.json({
    message: 'Student Management API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      payments: '/api/payments',
      auth: '/api/auth'
    }
  });
});

// Health check route - useful for monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));