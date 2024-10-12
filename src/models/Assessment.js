const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },  
    name: { type: String, required: true},
    type: {
        type: String,
        enum: ['presentation', 'assignment', 'exam'],
        required: true
    },
    assessingStaffMember: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    weightage: { type: Number, required: true },
    Date: { type: Date, required: true },
    TotalMarks: { type: Number, required: true },

});

module.exports = mongoose.model('Assessment', AssessmentSchema);     