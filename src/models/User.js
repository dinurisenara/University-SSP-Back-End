const mongoose = require ('mongoose');

 
const Schema = mongoose.Schema;

const UserSchema = new Schema({  

    userID: { type: String, unique: true },   
    fName: {type: String, required: true},
    lName: {type: String , required: true},  
    email : {type: String , unique: true , required: true},
    password : {type: String , required: true},
    mobile : {type: Number , required: true},    
    accountStatus: {type: String},
    // type: {type: String,enum: ['Student', 'Academic Staff', 'Non-Academic Staff', 'Management Staff'] , required: true},
    // type: {
    //     name: { type: String, enum: ['Admin', 'Student', 'Academic Staff', 'Non Academic Staff', 'Management Staff'], required: true },
    //     code: { type: Number, required: true }
    // },
    type: { 
        type: Number, 
        enum: [5150, 1984, 2001, 2002, 2003],   
        required: true 
    },


    // student
    courseID: {type: String},
    modules: {type: Array},
    year: {type: Number},
    semester: {type: Number},
    GPA: {type: Number},

    // ACADEMIC STAFF
    department: {type: String},
   
});
    

module.exports = mongoose.model('User', UserSchema);