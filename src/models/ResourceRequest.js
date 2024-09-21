const mongoose = require('mongoose');   
const Schema = mongoose.Schema;

const ResourceRequestSchema = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the student user
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true }, // Reference to the Resource    
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Status of the request
    requestDate: { type: Date, default: Date.now }, // Date of the request
    approvalDate: { type: Date },  // Date of approval or rejection
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who approved/rejected the request
    requestedStartTime: {
    type: Date,
    required: true,
  }, // Start time of the requested slot
  requestedEndTime: {
    type: Date,
    required: true,
  }, // End time of the requested slot
});

module.exports = mongoose.models.ResourceRequest || mongoose.model('ResourceRequest', ResourceRequestSchema);

