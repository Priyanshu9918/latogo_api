const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  const { title, description, category, level } = req.body;

  try {
    if (!title || !description || !category || !level) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      level,
    });

    await newCourse.save();
    res.status(201).json({ msg: 'Course created successfully', course: newCourse });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateCourse = async (req, res) => {
  const { title, description, category, level } = req.body;
  const courseId = req.params.id;

  try {
    let course = await Course.findById(courseId);
    if (!course) return res.status(400).json({ msg: 'Course not found' });

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;

    await course.save();
    res.status(201).json({ msg: 'Course updated successfully', course });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    let course = await Course.findByIdAndDelete(courseId);
    if (!course) return res.status(400).json({ msg: 'Course not found' });

    res.status(201).json({ msg: 'Course deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('category').populate('level');
    res.status(200).json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCourseById = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId).populate('category').populate('level');
    if (!course) return res.status(400).json({ msg: 'Course not found' });

    res.status(200).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};