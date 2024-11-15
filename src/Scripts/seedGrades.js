const mongoose = require('mongoose');
const Grade = require('../models/Gradings'); // Adjust the path as necessary
const { ObjectId } = mongoose.Types;

require('dotenv').config({path: '../../.env'});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data for seeding with specified module OIDs
const gradeData = [
  {
    studentId: new ObjectId('6732d588314469e6c395b917'), // Student with grades upto SEY2S2M2
    gradings: [
      {
        moduleId: new ObjectId('66cd98ad4e86f78c848d0059'), // SEY1S1M1
        grade: 85,
        gradeDate: new Date('2023-09-15')
      },
      {
        moduleId: new ObjectId('66cd98ad4e86f78c848d005a'), // SEY1S1M2
        grade: 90,
        gradeDate: new Date('2023-10-10')
      },
      {
        moduleId: new ObjectId('66cd98ad4e86f78c848d005b'), // SEY1S2M1
        grade: 78,
        gradeDate: new Date('2023-11-01')
      },
      {
        moduleId: new ObjectId('66cd98ad4e86f78c848d005c'), // SEY1S2M2
        grade: 88,
        gradeDate: new Date('2023-12-05')
      },
      {
        moduleId: new ObjectId('66cd98ad4e86f78c848d005d'), // SEY2S1M1
        grade: 75,
        gradeDate: new Date('2024-01-10')
      },
      {
        moduleId: new ObjectId('66cd98ad4e86f78c848d005e'), // SEY2S1M2
        grade: 89,
        gradeDate: new Date('2024-02-15')
      },
      {
        moduleId: new ObjectId('66cd98ad4e86f78c848d005f'), // SEY2S2M1
        grade: 92,
        gradeDate: new Date('2024-03-20')
      },
      {
        moduleId: new ObjectId('66cd98ad4e86f78c848d0060'), // SEY2S2M2
        grade: 81,
        gradeDate: new Date('2024-04-25')
      }
    ]
  },
  {
    studentId: new ObjectId('673780746227c597c04c99f9'), // New student with grades up to SEY2S2M2
    gradings: [
      { moduleId: new ObjectId('66cd98ad4e86f78c848d0059'), grade: 83, gradeDate: new Date('2023-09-17') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005a'), grade: 87, gradeDate: new Date('2023-10-12') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005b'), grade: 80, gradeDate: new Date('2023-11-05') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005c'), grade: 85, gradeDate: new Date('2023-12-10') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005d'), grade: 77, gradeDate: new Date('2024-01-12') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005e'), grade: 91, gradeDate: new Date('2024-02-17') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005f'), grade: 88, gradeDate: new Date('2024-03-25') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d0060'), grade: 84, gradeDate: new Date('2024-04-27') }
    ]
  },
  {
    studentId: new ObjectId('6737818c6227c597c04c99fe'), // Another new student with grades up to SEY2S2M2
    gradings: [
      { moduleId: new ObjectId('66cd98ad4e86f78c848d0059'), grade: 86, gradeDate: new Date('2023-09-20') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005a'), grade: 88, gradeDate: new Date('2023-10-15') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005b'), grade: 79, gradeDate: new Date('2023-11-07') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005c'), grade: 86, gradeDate: new Date('2023-12-15') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005d'), grade: 80, gradeDate: new Date('2024-01-15') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005e'), grade: 93, gradeDate: new Date('2024-02-20') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d005f'), grade: 89, gradeDate: new Date('2024-03-30') },
      { moduleId: new ObjectId('66cd98ad4e86f78c848d0060'), grade: 82, gradeDate: new Date('2024-05-01') }
    ]
  },
  {
    studentId: new ObjectId('6733152bd7b72bcf04637c16'), // Student with grades upto SEY1S2M2
    gradings: [
        {
            moduleId: new ObjectId('66cd98ad4e86f78c848d0059'), // SEY1S1M1
            grade: 85,
            gradeDate: new Date('2023-09-15')
          },
          {
            moduleId: new ObjectId('66cd98ad4e86f78c848d005a'), // SEY1S1M2
            grade: 90,
            gradeDate: new Date('2023-10-10')
          },
          {
            moduleId: new ObjectId('66cd98ad4e86f78c848d005b'), // SEY1S2M1
            grade: 78,
            gradeDate: new Date('2023-11-01')
          },
          {
            moduleId: new ObjectId('66cd98ad4e86f78c848d005c'), // SEY1S2M2
            grade: 88,
            gradeDate: new Date('2023-12-05')
          },
    ]
  }
];

// Seed function to insert data
async function seedGrades() {
  try {
    await Grade.insertMany(gradeData);
    console.log('Grades seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding grades:', error);
    mongoose.connection.close();
  }
}

seedGrades();
