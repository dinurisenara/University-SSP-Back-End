const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Class = require('./../models/Class'); // Assuming your Class model is in models/Class.js
const Course = require('./../models/Course');
const AcademicYear = require('./../models/AcademicYear');
const User = require('./../models/User');
const Resource = require('./../models/Resource');



const seedClasses = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = "mongodb+srv://ADMIN:r0u9JkZG27pY3FJm@university-portal.kd2tgzq.mongodb.net/universityDB?retryWrites=true&w=majority";

    await mongoose.connect(
        mongoURI, 
         { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('Connected to MongoDB');

    // Get existing references for course, academic year, students, academic staff, and resources
    const academicStaff = await User.find({type:2001});
    const resources = await Resource.find();

    // Class Data 

    const classes = [
    // Two classes for Software Engineering (SE)
    {
      classId: "SEY1S1C1",
      className: "Introduction to Programming Class",
      description: "Class for Introduction to Programming",
      moduleId: "66cd98ad4e86f78c848d0059",
      semesterId: "66cd98ad4e86f78c848d004c",
      students: [],
      academicStaff: [],
      location: "66e0f9875433d21542edda8b",
      fixedSchedule:{
        dayOfWeek: "Wednesday",
        startTime: "08:00 AM",
        endTime: "10:00 AM"
      }
    },
    {
      classId: "SEY2S1C2",
      className: "Database Management Systems Class",
      description: "Class for Database Management Systems",
      moduleId: "66cd98ad4e86f78c848d005e",
      semesterId: "66cd98ad4e86f78c848d004e",
      students: [],
      academicStaff: [],
      location: "66e0f9875433d21542edda8b",
      fixedSchedule: {
        dayOfWeek: "Monday",
        startTime: "10:00 AM",
        endTime: "12:00 PM"
      }
    },
    // Two classes for Computer Science (CS)
    {
      classId: "CY1S1C1",
      className: "Fundamentals of Cybersecurity Class",
      description: "Class for Fundamentals of Cybersecurity",
      moduleId: "66cd98ad4e86f78c848d0065",
      semesterId: "66cd98ad4e86f78c848d0052",
      students: [],
      academicStaff: [],
      location: "66e0f9875433d21542edda8b",
      fixedSchedule: {
        dayOfWeek: "Tuesday",
        startTime: "10:00 AM",
        endTime: "12:00 PM"
      }
    },
    {
      classId: "CY2S1C1",
      className: "Ethical Hacking Class",
      description: "Class for Ethical Hacking",
      moduleId: "66cd98ad4e86f78c848d0069",
      semesterId: "66cd98ad4e86f78c848d0054",
      students: [],
      academicStaff: [],
      location: "66e0f9875433d21542edda8b",
      fixedSchedule: {
        dayOfWeek: "Wednesday",
        startTime: "10:00 AM",
        endTime: "12:00 PM"
      }
    }
];

      
    // Loop through the class data and assign matching students
    for (let classData of classes) {
        const studentsForClass = await User.find({ type: 1984, semester: classData.semesterId });
  
        classData.students = studentsForClass.map(student => student._id); // Assign the student IDs to the class
      }

    // Insert generated classes into the database
    await Class.insertMany(classes);
    console.log('Successfully seeded classes');
  } catch (error) {
    console.error('Error seeding classes:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

seedClasses();
