// src/controllers/userController.js

const User = require('../models/User'); // Assuming User is the correct model

exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.query.userID; // Assuming the query parameter is userID
        console.log("getUSerlog",req);
        console.log(userId)
        // Find the user  by userID (not by _id)
        const user = await User.findOne({ userID: userId }).select('-password'); // Exclude the password
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

