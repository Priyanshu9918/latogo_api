const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createStudent = async (req, res) => {
  const { name, email, password, course,level } = req.body;

  // try {   
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if( name.length < 3 || password.length < 6) {
      return res.status(400).json({ msg: 'Name must be at least 3 characters and password at least 6 characters long' });
    }
    if(password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // const salt = await bcrypt.genSalt(10);
    // password = await bcrypt.hash(password, salt);

    const io = req.app.get("io");
    io.emit("newNotification", {
      message: `New student registered: ${name}`,
      time: new Date()
    });

    // Create new student
    const newStudent = new Student({
      name,
      email,
      password,
      course: course || [],
      level: level || [],
    });

    // Save student to database 
    await newStudent.save();

    res.status(201).json({ msg: 'Student created successfully', student: newStudent });
  // } catch (err) {
  //   console.error(err.message);
  //   res.status(500).send('Server Error');
  // }
};

exports.studentLogin = async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }
 
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
 
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
 
    const payload = { student: { id: student.id } };
 
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
 
        res.json({
          token,
          user_type:
            student.user_type === 1
              ? 'teacher'
              : student.user_type === 2
              ? 'student'
              : 'unknown',
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateStudent = async (req, res) => {
  const { name, email, password, course,level } = req.body;
  const studentId = req.params.id;

  try {
    let student = await Student.findById(studentId);
    if (!student) return res.status(400).json({ msg: 'Student not found' });

    if (name) student.name = name;
    if (email) student.email = email;
    if (password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password, salt);
    }
    if (course) student.course = course;
    if (level) student.level = level;

    await student.save();
    res.status(201).json({ msg: 'Student updated successfully', student });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    let student = await Student.findByIdAndDelete(studentId);
    if (!student) return res.status(400).json({ msg: 'Student not found' });

    res.status(201).json({ msg: 'Student deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getStudentInfo = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    
    if (!student) return res.status(400).json({ msg: 'Student not found' });

    res.status(200).json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
