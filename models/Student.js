const mangoose = require('mongoose');
const Schema = mangoose.Schema;

const CourseSchema = new Schema({
  name: {
    type:String,
    Required:true
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
    required: true, // 1 for teacher, 2 for student
    default: 2 // Default to student
  },
  course: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  level: [{
    type: Schema.Types.ObjectId,
    ref: 'level'
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mangoose.model('Student', CourseSchema);   