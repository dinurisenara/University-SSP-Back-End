const mongoose = require('mongoose');


const CourseSchema = new mongoose.Schema({
  courseId: String,
  courseName: String,
  description: String,
});

module.exports = mongoose.model('Course', CourseSchema);
