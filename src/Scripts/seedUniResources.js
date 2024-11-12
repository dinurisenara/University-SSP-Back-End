require('dotenv').config({path: '../../.env'}); // Load environment variables
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const UniResource = require('../models/UniResource'); // Adjust path if necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load JSON data
const filePath = path.join(__dirname, '../seeders/uniresources.json');
const uniResourcesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Seed the database
async function seedUniResources() {
  try {
    for (let resource of uniResourcesData) {
      await UniResource.findByIdAndUpdate(
        resource._id.$oid,
        {
          _id: resource._id.$oid,
          resourceName: resource.resourceName,
          resourceType: resource.resourceType,
          availabilityStatus: resource.availabilityStatus,
          description: resource.description,
          resourceOwner: resource.resourceOwner ? resource.resourceOwner.$oid : null,
        },
        { upsert: true }
      );
    }
    console.log('UniResource seeding completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding UniResource:', error);
    mongoose.connection.close();
  }
}

seedUniResources();
