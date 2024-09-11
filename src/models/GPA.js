const mongoose = require('mongoose');   
const Schema = mongoose.Schema;


const GPASchema = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the student user
    currentGPA: { type: Number, required: true },  // Current GPA of the student
    predictedGPA: { type: Number },  // Predicted GPA based on AI algorithm
    lastUpdated: { type: Date, default: Date.now }, // Last updated date for the GPA calculation
});

module.exports = mongoose.model('GPA', GPASchema);
