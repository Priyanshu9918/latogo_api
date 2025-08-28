const mangoose = require('mongoose');
const Schema = mangoose.Schema;

const LevelSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mangoose.model('Level', LevelSchema);
