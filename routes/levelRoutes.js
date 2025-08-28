const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');
const { createLevel, updateLevel, deleteLevel, getAllLevels, getLevelById } = require('../controllers/levelController');

// Route to create a new level
Router.post('/create', auth, createLevel);


// Route to update an existing level
Router.put('/update/:id', auth, updateLevel);

Router.get('/edit/:id', auth, getLevelById);

// Route to delete a level
Router.delete('/delete/:id', auth, deleteLevel);

// Route to get all levels
Router.get('/',auth,getAllLevels);

module.exports = Router;
// This code defines the routes for level management in an Express application.