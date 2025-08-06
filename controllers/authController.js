const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendRegistrationEmail } = require('../utils/mailer'); // <-- import mailer
const req = require('express/lib/request');
const crypto = require('crypto'); 
const nodemailer = require('nodemailer');

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

    // await sendRegistrationEmail(email, name);
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
exports.allUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.userInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const users = await User.findById(userId);
    res.status(200).json(users.email ? users : { msg: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 3600000; // 1 hour
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service like 'hotmail', 'yahoo'
    auth: {
      user: process.env.MAIL_USERNAME, // e.g., 'youremail@gmail.com'
      pass: process.env.MAIL_PASSWORD  // Gmail app password (not regular password)
    }
  });


  const resetLink = `${process.env.BASE_URL}/reset_password/${token}`;

  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
  });

  res.json({ message: 'Password reset link sent to email',token:token,baseURL:resetLink });

}

exports.resetPassword = async(req,res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();
  res.json({ message: `Password has been reset successfully and your password is: ${newPassword}` });
}