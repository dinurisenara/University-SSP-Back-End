require('dotenv').config({path: '../../.env'}); // Load environment variables
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Semester = require('../models/Semester'); // Adjust path if necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load JSON data
const filePath = path.join(__dirname, '../seeders/semesters.json');
const semestersData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Seed the database
async function seedSemesters() {
  try {
    for (let semester of semestersData) {
      await Semester.findByIdAndUpdate(
        semester._id.$oid,
        {
          _id: semester._id.$oid,
          semesterId: semester.semesterId,
          semesterNumber: semester.semesterNumber,
          academicYear: semester.academicYear.$oid,
          modules: semester.modules ? semester.modules.map(module => module.$oid) : [],
        },
        { upsert: true }
      );
    }
    console.log('Semester seeding completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding Semester:', error);
    mongoose.connection.close();
  }
}

seedSemesters();
