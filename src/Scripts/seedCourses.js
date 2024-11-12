require('dotenv').config({path: '../../.env'});
const mongoose = require('mongoose');
const Course = require('../models/Course'); // Adjust the path as needed
const fs = require('fs');
const path = require('path');

console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load JSON data
const filePath = path.join(__dirname, '../seeders/courses.json');
const coursesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Seed the database
async function seedCourses() {
  try {
    for (let course of coursesData) {
      await Course.findByIdAndUpdate(
        course._id.$oid,
        {
          _id: course._id.$oid,
          courseId: course.courseId,
          courseName: course.courseName,
          description: course.description,
        },
        { upsert: true }
      );
    }
    console.log('Database seeding completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedCourses();