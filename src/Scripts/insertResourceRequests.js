const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const UniResourceRequest = require('../models/UniResourceRequest') // Adjust the path to your ResourceRequest model

// Connect to your MongoDB database
const MONGODB_URI = 'mongodb+srv://ADMIN:r0u9JkZG27pY3FJm@university-portal.kd2tgzq.mongodb.net/universityDB?retryWrites=true&w=majority';  // Replace with your MongoDB URI

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});

// Load the JSON file
const filePath = path.join(__dirname, 'resourcerequests.json');  // Adjust path if necessary
const requestData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Function to insert resource requests
const insertResourceRequests = async () => {
  try {
    // Loop through the request data and insert into the database
    await UniResourceRequest.insertMany(requestData.map(item => ({
      _id: item._id.$oid,
      studentId: item.studentId.$oid,
      resourceId: item.resourceId.$oid,
      status: item.status,
      requestDate: new Date(item.requestDate.$date),
      approvalDate: item.approvalDate ? new Date(item.approvalDate.$date) : null,
      requestedStartTime: new Date(item.requestedStartTime.$date),
      requestedEndTime: new Date(item.requestedEndTime.$date),
      approvedBy: item.approvedBy ? item.approvedBy.$oid : null
    })));

    console.log('Resource request data inserted successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting resource request data:', error.message);
  }
};

insertResourceRequests();
