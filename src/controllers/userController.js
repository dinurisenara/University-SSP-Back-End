// src/controllers/userController.js

const Course = require('../models/Course');
const User = require('../models/User'); // Assuming User is the correct model

exports.getUserDetails = async (req, res) => {
    try {
        const {id} = req.query // Assuming the query parameter is userID
        console.log("getUSerlog",req);
        console.log(id)
        // Find the user  by userID (not by _id)
        const user = await User.findById(id).select('-password').populate([
            {
              path: 'course', // The field you want to populate
              select: 'courseName', // Select specific fields to return
            },
            {
              path: 'semester',           
              select: 'semesterNumber', // Select specific fields to return
            },{
                path:'academicYear',
                select:'yearNumber'
            },
            {
              path:'modules',
              select:'moduleName'
            }
          ]); // Exclude the password
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Send the user data back as a response 
        res.json(user); 
    } catch (error) {
        console.error(error.message);  
        res.status(500).send('Server error');   
    }
};

