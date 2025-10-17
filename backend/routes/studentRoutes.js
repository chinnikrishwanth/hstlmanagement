const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAvailableRooms
} = require('../controllers/studentController');
const { validateStudent } = require('../middleware/validation');

// Student routes
router.get('/', getAllStudents);
router.get('/rooms/available', getAvailableRooms);
router.get('/:id', getStudentById);
router.post('/', validateStudent, createStudent);
router.put('/:id', validateStudent, updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
