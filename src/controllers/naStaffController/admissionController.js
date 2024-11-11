const User = require('../../models/User');
const nodemailer = require('nodemailer');

// Async function to toggle user account status
exports.toggleAccountStatus = async (req, res) => {
    try {
        const { userId } = req.query; // Assuming you're passing the userId as a route param
        console.log("userId for activating ",userId);
        // Find the user by userId
        const user = await User.findOne({ _id:userId });
        console.log("user for activating ",user);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Toggle the account status between 'active' and 'inactive'
        user.accountStatus = user.accountStatus === 'active' ? 'inactive' : 'active';

        // Save the updated user
        await user.save();

        // If the account was activated, send the activation email
        if (user.accountStatus === 'active') {
            await sendActivationEmail(user.email, user.userId); // Call email function
        }

        return res.status(200).json({
            message: `Account status updated to ${user.accountStatus}`,
            success: true,
        });
    } catch (error) {
        console.error('Error toggling account status:', error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// Async function to get inactive user accounts sorted by creation date (most recent first)
exports.getInactiveUsers = async (req, res) => {
    try {
        // Find users with 'inactive' account status and sort by creation time in descending order
        const inactiveUsers = await User.find({ accountStatus: 'inactive' })
            .sort({ _id: -1 }); // -1 for descending (most recent first)

        // If no inactive users found
        if (!inactiveUsers.length) {
            return res.status(404).json({ message: 'No inactive users found', success: false });
        }

        // Return the sorted inactive users
        return res.status(200).json({
            message: 'Inactive users retrieved successfully',
            success: true,
            data: inactiveUsers
        });
    } catch (error) {
        console.error('Error fetching inactive users:', error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};





// Function to send an email to the user when account status is toggled to active
 const sendActivationEmail = async (userEmail , userId) => {
    try {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use your preferred email service
            auth: {
                user: 'damelzashekalbolt@gmail.com', // Your email
                pass: 'qnad qgfm jflr smqb', // Your email password (or app-specific password if using 2FA)
            },
        });

        // Define email options
        const mailOptions = {
            from: 'damelzashekalbolt@gmail.com', // Sender address
            to: userEmail, // Recipient address (the user's email)
            subject: 'Account Activated', // Subject line
            text: `Your account with User ID: ${userId} has been activated!`, // Email content
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Activation email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

