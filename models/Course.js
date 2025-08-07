const mangoose = require('mongoose');
const Schema = mangoose.Schema;


const CourseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    level: {
        type: Schema.Types.ObjectId,
        ref: 'Level',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mangoose.model('Course', CourseSchema);