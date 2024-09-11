const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');
const User = require('./../models/User'); // Adjust the path to your User model
const Course = require('../models/Course');
const Semester = require('../models/Semester');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

const seedUser = async () => {
    try {
        const mongoURI = "mongodb+srv://ADMIN:r0u9JkZG27pY3FJm@university-portal.kd2tgzq.mongodb.net/universityDB?retryWrites=true&w=majority";

        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log("Connected to MongoDB");

        // Collect user input
        const userId = await askQuestion('Enter user ID: ');
        const fName = await askQuestion('Enter first name: ');
        const lName = await askQuestion('Enter last name: ');
        const email = await askQuestion('Enter email: ');
        const plainPassword = await askQuestion('Enter password: ');
        const mobile = await askQuestion('Enter mobile number: ');
        const accountStatus = await askQuestion('Enter account status: ');
        const type = await askQuestion('Enter user type (e.g., 5150 for admin): ');
        const course = await askQuestion('Enter course "SE"  or  "CY" (or leave blank): ');
        const semester = await askQuestion('Enter semester (or leave blank): ');

        // Hash the password
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const courseDoc = await Course.findOne({ courseId: course });
        const courseRef = courseDoc ? courseDoc._id : null; // Check if course exists, then get the _id

        const semesterDoc = await Semester.findOne({ semesterId: semester });
        const semesterRef = semesterDoc ? semesterDoc._id : null; // Check if semester exists, then get the _id


        // Create a new user with the input and hashed password
        const newUser = new User({
            userId,
            fName,
            lName,
            email,
            password: hashedPassword, // Store the hashed password
            mobile: Number(mobile),
            accountStatus,
            type: Number(type), // Convert type to number
            course: courseRef || null, // Handle empty course input
            semester: semesterRef || null // Handle empty semester input
        });

        // Save the new user to the database
        await newUser.save();
        console.log("User account created successfully!");

        // Close the database connection
        mongoose.connection.close();
        rl.close();
    } catch (error) {
        console.error("Error creating user:", error);
        rl.close();
    }
};

seedUser();
