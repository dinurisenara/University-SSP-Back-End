const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./../models/User'); // Adjust the path to your User model

const seedAdmin = async () => {
    try {
        const mongoURI = "mongodb+srv://ADMIN:r0u9JkZG27pY3FJm@university-portal.kd2tgzq.mongodb.net/universityDB?retryWrites=true&w=majority";

    await mongoose.connect(
        mongoURI, 
         { useNewUrlParser: true, useUnifiedTopology: true });

        console.log("Connected to MongoDB");

        // Hash the password
        const plainPassword = 'adminpassword'; // Original password (to be hashed)
        const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password

        // Create a new admin user with the hashed password
        const adminUser = new User({
            userId: 'admin123',
            fName: 'Admin',
            lName: 'User',
            email: 'admin@example.com',
            password: hashedPassword, // Store the hashed password
            mobile: 712105774,
            accountStatus: 'Active',
            type: 5150, // 5150 corresponds to the admin role
            course: null,
            semester: null
        });

        // Save the admin user to the database
        await adminUser.save();
        console.log("Admin account created successfully!");

        // Close the database connection
        mongoose.connection.close();
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
};

seedAdmin();
