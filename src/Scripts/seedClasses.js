require('dotenv').config({path: '../../.env'}); // Load environment variables
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Class = require('../models/Class'); // Adjust path if necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load JSON data
const filePath = path.join(__dirname, '../seeders/classes.json');
const classesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Seed the database
async function seedClasses() {
  try {
    for (let cls of classesData) {
      await Class.findByIdAndUpdate(
        cls._id.$oid,
        {
          _id: cls._id.$oid,
          classId: cls.classId,
          className: cls.className,
          moduleId: cls.moduleId.$oid,
          semesterId: cls.semesterId.$oid,
          description: cls.description,
          location: cls.location ? cls.location.$oid : null,
          fixedSchedule: {
            dayOfWeek: cls.fixedSchedule.dayOfWeek,
            startTime: cls.fixedSchedule.startTime,
            endTime: cls.fixedSchedule.endTime,
          },
          students: cls.students ? cls.students.map(student => student.$oid) : [],
          academicStaff: cls.academicStaff ? cls.academicStaff.map(staff => staff.$oid) : [],
        },
        { upsert: true }
      );
    }
    console.log('Class seeding completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding Class:', error);
    mongoose.connection.close();
  }
}

seedClasses();
