// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const GradingSchema = new Schema({
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the student user
//     moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true }, // Reference to the Module
//     grade: { type: Number, required: true },  // Numeric grade or score
//     gradeDate: { type: Date, default: Date.now }, // Date when the grade was recorded
// });

// module.exports = mongoose.model('Grading', GradingSchema);

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

// Create the Grades model
const Grade = mongoose.model('Grade', gradesSchema);

module.exports = Grade;
