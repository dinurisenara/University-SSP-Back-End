require('dotenv').config({path: '../../.env'}); // Load environment variables
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const AcademicYear = require('../models/AcademicYear'); // Adjust path if necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load JSON data
const filePath = path.join(__dirname, '../seeders/academicyears.json');
const academicYearsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Seed the database
async function seedAcademicYears() {
  try {
    for (let academicYear of academicYearsData) {
      await AcademicYear.findByIdAndUpdate(
        academicYear._id.$oid,
        {
          _id: academicYear._id.$oid,
          academicYearId: academicYear.academicYearId,
          yearNumber: academicYear.yearNumber,
          course: academicYear.course.$oid,
        },
        { upsert: true }
      );
    }
    console.log('AcademicYear seeding completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding AcademicYear:', error);
    mongoose.connection.close();
  }
}

seedAcademicYears();
