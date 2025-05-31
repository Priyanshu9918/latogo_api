const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendRegistrationEmail } = require('../utils/mailer'); // <-- import mailer

exports.register = async (req, res) => {
  const { name, email, password, user_type } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password, user_type });
    if (!user_type) {
      user.user_type = '1'; // Default user type
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    await sendRegistrationEmail(email, name);
    // Send registration email
    
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      // Include user_type in the response
      res.json({
        token,
        user_type: user.user_type === 1 ? 'teacher' : user.user_type === 2 ? 'student' : 'unknown'
      });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: 'User not found' });

    if(name) user.name = name;
    if(email) user.email = email;

    if(password){
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
    }

    await user.save();

    res.status(201).json({ msg: 'User updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    let user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(400).json({ msg: 'User not found' });

    res.status(201).json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};