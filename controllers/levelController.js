const Level = require('../models/Level');

exports.createLevel = async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingLevel = await Level.find({ name });
    if (existingLevel.length > 0) {
      return res.status(400).json({ msg: 'Level already exists' });
    }
    
    if (!name || !description) {
      return res.status(400).json({ msg: 'Name and description are required' });
    }
    if (name.length < 3 || description.length < 10) {
      return res.status(400).json({ msg: 'Name must be at least 3 characters and description at least 10 characters long' });
    }
    const newLevel = new Level({
      name,
      description,
    });

    await newLevel.save();
    res.status(201).json({ msg: 'Level created successfully', level: newLevel });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getLevelById = async (req,res) => {
  const levelId = req.params.id;

  try {
    const check = await Level.findById(levelId);
    console.log(check);
    if(!check){
      res.status(404).json('data not found');
    }
    res.status(200).json(check);

  }catch(excepton){
    res.status(500).send('Server Error');
  }
}
exports.updateLevel = async (req, res) => {
  const { name, description } = req.body;
  const levelId = req.params.id;

  try {
    let level = await Level.findById(levelId);
    if (!level) return res.status(400).json({ msg: 'Level not found' });

    if (name) level.name = name;
    if (description) level.description = description;

    await level.save();
    res.status(201).json({ msg: 'Level updated successfully', level });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteLevel = async (req, res) => {
  const levelId = req.params.id;

  try {
    let level = await Level.findByIdAndDelete(levelId);
    if (!level) return res.status(400).json({ msg: 'Level not found' });

    res.status(201).json({ msg: 'Level deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find();
    res.status(200).json(levels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};