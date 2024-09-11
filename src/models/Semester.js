const mongoose = require('mongoose');


const SemesterSchema = new mongoose.Schema({
  semesterId: String,
  semesterNumber: Number,
  academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }]
});

module.exports = mongoose.model('Semester', SemesterSchema);
