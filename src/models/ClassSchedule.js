  const mongoose = require('mongoose');

  const ClassScheduleSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },         // Date of the extra/rescheduled class
    startTime: { type: Date, required: true },     // Start time as Date object
    endTime: { type: Date, required: true },       // End time as Date object// e.g., 16:00 (4:00 PM)
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' , required: true},    // Location for the extra/rescheduled class
  });


  // Custom validation to ensure endTime is after startTime
ClassScheduleSchema.path('endTime').validate(function (value) {
  return this.startTime < value;
}, 'End time must be after start time');


  module.exports = mongoose.model('ClassSchedule', ClassScheduleSchema);
  