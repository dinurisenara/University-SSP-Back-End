const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const ResourceRequest = require('./../models/ResourceRequest'); // Assuming the model is in the models folder
const User = require('./../models/User'); // User model to reference students and approvers
const Resource = require('./../models/Resource'); // Resource model to reference resources

// Connect to MongoDB
const mongoURI = "mongodb+srv://ADMIN:r0u9JkZG27pY3FJm@university-portal.kd2tgzq.mongodb.net/universityDB?retryWrites=true&w=majority";

     mongoose.connect(
        mongoURI, 
         { useNewUrlParser: true, useUnifiedTopology: true });

// Function to generate random data for seeding
const createResourceRequest = async () => {
  // Fetch sample users (students and approvers) and resources from the database
  const students = await User.find({ type:1984}).limit(10); // Assuming you have roles in User schema
  const resourceOwner = await User.find({ type: 2002 , department:"Resource Management" }).limit(5); // Adjust according to your system roles
  const resources = await Resource.find().limit(5);

  // Create an array of resource request objects
  const requests = [];

  for (let i = 0; i < 10; i++) {
    const student = faker.helpers.arrayElement(students);
    const approver = faker.helpers.arrayElement(resourceOwner);
    const resource = faker.helpers.arrayElement(resources);

    const requestStartTime = faker.date.soon(7); // Start time within the next 7 days
    const requestEndTime = new Date(requestStartTime.getTime() + 60 * 60 * 1000); // End time 1 hour later

    const request = new ResourceRequest({
      studentId: student._id,
      resourceId: resource._id,
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
      requestDate: faker.date.past(),
      approvalDate: faker.date.soon(1), // Approval date (soon)
      approvedBy: resourceOwner._id,
      requestedStartTime: requestStartTime,
      requestedEndTime: requestEndTime,
    });

    requests.push(request);
  }

  // Insert the resource requests into the database
  await ResourceRequest.insertMany(requests);
  console.log('Resource Requests Seeded!');
};

// Seed the data and close the database connection
createResourceRequest().then(() => {
  mongoose.connection.close();
});
