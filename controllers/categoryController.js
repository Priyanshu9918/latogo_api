const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

exports.indexCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    let category = await Category.findOne({ name });
    if (category) return res.status(400).json({ msg: 'Category already exists' });

    category = new Category({ name, description });
    await category.save();
    res.status(201).json({ msg: 'Category created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const categoryId = req.params.id;

  try {
    let category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ msg: 'Category not found' });

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();
    res.status(200).json({ msg: 'Category updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    let category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ msg: 'Category not found' });

    await category.remove();
    res.status(200).json({ msg: 'Category deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};  