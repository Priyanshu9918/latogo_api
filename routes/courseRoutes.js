const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');
const { createLevel, updateLevel, deleteLevel,getAllCourses,getCourseById, } = require('../controllers/levelController');

// Route to create a new level
Router.post('/create', auth, createLevel);

// Route to update an existing level
Router.put('/update/:id', auth, updateLevel);   

// Route to delete a level
Router.delete('/delete/:id', auth, deleteLevel);

// Route to get all levels
Router.get('/', auth, getAllLevels);

// Route to get a level by ID
Router.get('/:id', auth, getCourseById);

module.exports = Router;
// This code defines the routes for level management in an Express application. It includes routes for creating, updating, deleting, and retrieving levels.