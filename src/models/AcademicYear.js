const mongoose = require('mongoose');

const AcademicYearSchema = new mongoose.Schema({
  academicYearId: String,
  yearNumber: Number,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },  
});

module.exports = mongoose.model('AcademicYear', AcademicYearSchema);
