// src/controllers/userController.js

const User = require('../models/User'); // Assuming User is the correct model

exports.getUserDetails = async (req, res) => {
    try {
        const {id} = req.query // Assuming the query parameter is userID
        console.log("getUSerlog",req);
        console.log(id)
        // Find the user  by userID (not by _id)
        const user = await User.findById(id).select('-password'); // Exclude the password
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

