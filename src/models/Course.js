const mongoose = require('mongoose');


const CourseSchema = new mongoose.Schema({
 courseId: String,
  courseName: String,
  description: String,
  years: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' }]
});

module.exports = mongoose.model('Course', CourseSchema);
