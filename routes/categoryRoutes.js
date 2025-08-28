const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { indexCategory, createCategory, getCategoryInfo, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Route to get all categories
router.get('/', auth, indexCategory);
// Route to create a new category
router.post('/create', auth, createCategory);
// Route to edit an existing category
router.put('/edit/:id', auth, getCategoryInfo);
// Route to update an existing category
router.put('/update/:id', auth, updateCategory);
// Route to delete a category
router.delete('/delete/:id', auth, deleteCategory);

module.exports = router;
// This code defines the routes for category management in an Express application.