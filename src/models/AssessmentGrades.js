const mongoose = require ('mongoose');
const Assessment = require('./Assessment');

const AssessmentGradesSchema = new mongoose.Schema({     
    studentId : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assessmentId : { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
    achievedMarks : { type: Number , required: true },
});

module.exports = mongoose.model('AssessmentGrades',AssessmentGradesSchema);