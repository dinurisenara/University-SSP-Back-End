const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Check if the model already exists and delete it
if (mongoose.models.Resource) {
    delete mongoose.models.Resource;
}

const ResourceSchema = new Schema({
    resourceName: { type: String, required: true },  // Name of the resource
    resourceType: { type: String, enum: ['Library', 'Lab', 'SportingUtility', 'Facility'], required: true },  // Type of resource
    availabilityStatus: { type: String, enum: ['available',  'maintenance'], default: 'available' }, // Availability status of the resource
    description: { type: String }, // Additional details or description of the resource,
    resourceOwner: { type: Schema.Types.ObjectId, ref: 'User' }, // Owner of the resource
    
});

// Check if the model already exists before defining it
module.exports =  mongoose.model('Resource', ResourceSchema);
