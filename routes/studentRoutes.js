const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createStudent, updateStudent, deleteStudent, getAllStudents ,getStudentInfo} = require('../controllers/studentController');

// Route to create a new student
router.post('/create', auth, createStudent);

// Route to update an existing student
router.put('/update/:id', auth, updateStudent);

// Route to delete a student
router.delete('/delete/:id', auth, deleteStudent);

// Route to get all students
router.get('/', auth, getAllStudents);

// Route to get student information by ID
router.get('/:id', auth, getStudentInfo);

module.exports = router;
// This code defines the routes for student management in an Express application.