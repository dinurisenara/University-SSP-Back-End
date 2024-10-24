const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uniResourceSchema = new Schema({
    resourceName: { type: String, required: true },  // Name of the resource
    resourceType: { type: String, enum: ['Library', 'Lab', 'SportingUtility', 'Facility'], required: true },  // Type of resource
    availabilityStatus: { type: String, enum: ['available', 'maintenance'], default: 'available' }, // Availability status of the resource
    description: { type: String }, // Additional details or description of the resource,
    resourceOwner: { type: Schema.Types.ObjectId, ref: 'User' }, // Owner of the resource

});

module.exports = mongoose.model('UniResource', uniResourceSchema);