const mongoose = require ('mongoose');
const Course = require('./Course');
const Semester = require('./Semester');

 
const Schema = mongoose.Schema;

const UserSchema = new Schema({  

    userId: { type: String, unique: true },   
    fName: {type: String, required: true},
    lName: {type: String , required: true},  
    email : {type: String , unique: true , required: true},
    password : {type: String , required: true},
    mobile : {type: Number , required: true},    
    accountStatus: {type: String , enum: ['active', 'inactive'],default: 'inactive'},
  
    type: { 
        type: Number, 
        enum: [5150, 1984, 2001, 2002, 2003],   
        required: true 
    },


    //Student

    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    semester:{type: mongoose.Schema.Types.ObjectId, ref: 'Semester'},
    academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },

    //Non academic staff 
   department: { type: String , enum:['Admisssion' ,'Resource Management' , 'Administration' , 'Management' ]},

   //Academic Staff 

   modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],


   
   
});    
    

module.exports = mongoose.model('User', UserSchema);