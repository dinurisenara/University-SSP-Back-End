const mongoose = require('mongoose');
const UniResource = require('../models/UniResource');  // Adjust path to your Resource model
const fs = require('fs');
const path = require('path');

// Connect to your MongoDB database
const MONGODB_URI = 'mongodb+srv://ADMIN:r0u9JkZG27pY3FJm@university-portal.kd2tgzq.mongodb.net/universityDB?retryWrites=true&w=majority';  // Replace with your actual MongoDB URI

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});

// Load the JSON file
const filePath = path.join(__dirname, 'resources.json');  // Adjust path if needed
const resourceData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Function to insert resources
const insertResources = async () => {
  try {
    // Loop through the resource data and insert into the database
    await UniResource.insertMany(resourceData.map(item => ({
      _id: item._id.$oid,
      resourceName: item.resourceName,
      resourceType: item.resourceType,
      availabilityStatus: item.availabilityStatus,
      description: item.description,
      resourceOwner: item.resourceOwner.$oid  // Converting ObjectId
    })));

    console.log('Resource data inserted successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting resource data:', error.message);
  }
};

insertResources();
