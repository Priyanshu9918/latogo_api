const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { createStudent, updateStudent, deleteStudent, getAllStudents ,getStudentInfo,studentLogin} = require('../controllers/studentController');

// Route to create a new student
router.post('/create', createStudent);

//Route to login a new student
router.post('/login', studentLogin);

// Route to update an existing student
router.put('/update/:id', auth, authorize('2','0'), updateStudent);

// Route to delete a student
router.delete('/delete/:id', auth, authorize('2','0'), deleteStudent);

// Route to get all students
router.get('/', auth, authorize('2','0'), getAllStudents);

// Route to get student information by ID
router.get('/:id', auth, authorize('2','0'), getStudentInfo);

module.exports = router;
// This code defines the routes for student management in an Express application.