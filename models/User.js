const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  user_type: {
    type: Number,
    required: true,
    enum: [0, 1, 2], // 1 for teacher, 2 for student, 0 for admin
    default: 1 // Default to teacher
  },
  resetToken: {
    type: String
  },
  resetTokenExpire: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
