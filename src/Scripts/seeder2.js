const mongoose = require('mongoose');
const Gradings = require('../models/Gradings');
const Grade = require('../models/Gradings');


const seedDatabase = async () => {

    const mongoURI = "mongodb+srv://ADMIN:r0u9JkZG27pY3FJm@university-portal.kd2tgzq.mongodb.net/universityDB?retryWrites=true&w=majority";

    await mongoose.connect(
        mongoURI, 
         { useNewUrlParser: true, useUnifiedTopology: true });

         //Create gradings 

         const gradings = 
         [
            {
              studentId: new mongoose.Types.ObjectId('66cdafdf2bdb0f0d8087cea7'),
              gradings: [
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d0059'),
                  grade: 85,
                  gradeDate: new Date(),
                },
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d005a'),
                  grade: 78,
                  gradeDate: new Date(),
                },
              ],
            },
            {
              studentId: new mongoose.Types.ObjectId('66cdaff42bdb0f0d8087ceac'),
              gradings: [
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d0059'),
                  grade: 92,
                  gradeDate: new Date(),
                },
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d005a'),
                  grade: 88,
                  gradeDate: new Date(),
                },
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d005b'),
                  grade: 74,
                  gradeDate: new Date(),
                },
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d005c'),
                  grade: 80,
                  gradeDate: new Date(),
                },
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d005d'),
                  grade: 70,
                  gradeDate: new Date(),
                },
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d005e'),
                  grade: 82,
                  gradeDate: new Date(),
                },
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d005f'),
                  grade: 90,
                  gradeDate: new Date(),
                },
                {
                  moduleId: new mongoose.Types.ObjectId('66cd98ad4e86f78c848d0060'),
                  grade: 76,
                  gradeDate: new Date(),
                },
              ],
            },
          ];
            const createdGradings = await Grade.insertMany(gradings);      
            
            
            console.log('Data Seeded Successfully!');
            await mongoose.connection.close();
}

seedDatabase().catch(err => {
    console.error(err);
    mongoose.connection.close();
  });