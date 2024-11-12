require('dotenv').config({path: '../../.env'}); // Load environment variables
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Module = require('../models/Module'); // Adjust path if necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load JSON data
const filePath = path.join(__dirname, '../seeders/modules.json');
const modulesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Seed the database
async function seedModules() {
  try {
    for (let module of modulesData) {
      await Module.findByIdAndUpdate(
        module._id.$oid,
        {
          _id: module._id.$oid,
          moduleId: module.moduleId,
          moduleName: module.moduleName,
          description: module.description,
          semester: module.semester.$oid,
          course: module.course.$oid,
        },
        { upsert: true }
      );
    }
    console.log('Module seeding completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding Module:', error);
    mongoose.connection.close();
  }
}

seedModules();
