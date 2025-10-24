# Backend Structure

This backend has been restructured into a modular architecture with separate directories for different concerns.

## Directory Structure

```
backend/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   ├── studentController.js  # Student-related business logic
│   └── paymentController.js  # Payment-related business logic
├── middleware/
│   ├── errorHandler.js      # Error handling middleware
│   ├── validation.js        # Input validation middleware
│   └── index.js             # Middleware exports
├── models/
│   ├── Student.js           # Student schema
│   ├── FeePayment.js        # Fee payment schema
│   └── index.js             # Model exports
├── routes/
│   ├── studentRoutes.js     # Student API routes
│   ├── paymentRoutes.js     # Payment API routes
│   └── index.js             # Route exports
├── server.js                # Main application entry point
└── package.json             # Dependencies and scripts
```

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/rooms/available` - Get available rooms

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/student/:studentId` - Get payments for specific student
- `POST /api/payments` - Create new payment

## Features

- **Modular Architecture**: Separated concerns into different directories
- **Input Validation**: Middleware for validating request data
- **Error Handling**: Centralized error handling middleware
- **Database Connection**: Separate configuration for MongoDB connection
- **Clean Code**: Organized controllers, routes, and models

## Running the Application

```bash
npm start          # Production mode
npm run dev        # Development mode with nodemon
```

## Environment Variables

Make sure to set up your `.env` file with:
```
MONGOLINK=your_mongodb_connection_string
PORT=5000
```
