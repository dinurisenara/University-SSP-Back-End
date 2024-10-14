
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the grading schema for each module
const gradingSchema = new Schema({
  moduleId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Module', 
    required: true 
  },
  grade: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 100 
  },
  gradeDate: { 
    type: Date, 
    default: Date.now 
  }
});



// Define the grades schema for each student
const gradesSchema = new Schema({
  studentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  gradings: [gradingSchema] // Array of gradingSchema
});



module.exports = mongoose.model('Grade', gradesSchema);
