const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({               
    classId: String,
    className: String,    
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },    
    semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    description: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    academicStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AcademicStaff' }], 
    location:{type: mongoose.Schema.Types.ObjectId, ref: 'Resource'},
    fixedSchedule: {
    dayOfWeek: { type: String, required: true },  // e.g., Monday, Tuesday
    startTime: { type: String, required: true },  // e.g., 10:00 AM
    endTime: { type: String, required: true },    // e.g., 12:00 PM
  }
    }); 

module.exports = mongoose.model('Class', ClassSchema);