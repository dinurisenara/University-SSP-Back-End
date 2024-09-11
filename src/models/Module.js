const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
 moduleId: String,
  moduleName: String,
  description: String,
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } ,
  
});

module.exports = mongoose.model('Module', ModuleSchema);
