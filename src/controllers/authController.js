
require('dotenv').config();
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/Otp')
const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const ROLES_LIST = require('../config/roles_list');
const { v4: uuidv4 } = require('uuid');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { Console } = require('console');

 

// Register a new user

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, mobile, type, course } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);

        const role = ROLES_LIST[type.replace(/\s+/g, '_')];
        // Dynamically assign role based on the provided type


        const hashedPassword = await bcrypt.hash(password, salt);



        const enrolledCourse = role == 1984 ? await Course.findOne({ courseId: course }).select('_id').lean() : null;
        const prefix = enrolledCourse ? course : (role == 2002 ? 'NA' : (role == 2001 && 'AS'));

        //Generate a unique 10 digit number

        let userIdSuffix;

        do {
            userIdSuffix = Math.floor(Math.random() * 1000000000);
        } while (await User.findOne({ username: `${prefix}${userIdSuffix}` }));

        const userId = `${prefix}${userIdSuffix}`;

        console.log(enrolledCourse);
        user = new User({
            userId: userId,
            fName: firstName,
            lName: lastName,
            email: email,
            password: hashedPassword,
            mobile: mobile,
            type: role,
            course: enrolledCourse

        });

        await user.save();

        res.json({ msg: 'User registered successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Email verification 


//Email configuration 
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


//Generate and send OTP

exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    try {


        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newOtp = new Otp({
            email: email,
            otp
        })

        await newOtp.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for password reset',
            text: `Your OTP is ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ msg: 'Server Error' });
            }
            res.json({ msg: 'Otp sent' });
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


//Verify OTP 

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {

        const validOtp = await Otp.findOne({ email: email, otp });
        if (!validOtp) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }


        await Otp.deleteOne({ _id: validOtp.id });//Remove the used OTP

        const payload = {
            user: {
                email: email,
            }
        };

        return res.status(200).json({ msg: ' verified', payload });


    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }



};

// Login a user

// Login a user
exports.login = async (req, res) => {
    const { userId, password } = req.body;



    try {
        let user = await User.findOne({ userId });
        console.log("user matching the user ID", user);

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials no user to match teh user id' });
        }

        if (user.accountStatus == 'inactive') {
            return res.status(400).json({ msg: 'Account is inactive' });
        }

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials no user to match teh user id' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials password is incorrect' });
        }

        console.log(user)

        const payload = {
            user: {
                id: user._id,
                userId: user.userId,
                email: user.email,
                type: user.type,
                department: user.department
            }
        };
        console.log(payload)
        const accessToken = jwt.sign(
            payload, process.env.JWT_SECRET, { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            payload, process.env.REFRESH_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};


exports.refresh = async (req, res) => {
    const cookies = req.cookies

    if (!cookies.jwt) {
        return res.status(401).json({ msg: 'Unauthorized' });

    }
    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken, process.env.REFRESH_SECRET,
        asyncHandler(async (error, decoded) => {
            if (error) {
                return res.status(403).json({ msg: 'Forbidden' });
            }
            const foundUser = await User.findOne({ email: decoded.user.email });
            if (!foundUser) {
                return res.status(401).json({ msg: 'Unauthorized' });
            }

            const accessToken = jwt.sign(
                {
                    user: {
                        email: foundUser.email,
                        id: foundUser._id,
                        userId: foundUser.userId,
                        type: foundUser.type
                    },


                }, process.env.JWT_SECRET, { expiresIn: '1h' }
            )

            res.json({ accessToken });
        })
    )
}

exports.logout = async (req, res) => {
    const cookies = req.cookies;  
    if (!cookies.jwt) {
        return res.status(204) // No content
    }
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ msg: 'Logged out' });

}

exports.forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            // To prevent user enumeration, respond with a success message
            return res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the token before saving to DB for security
        const resetTokenHashed = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set reset token and expiry on user model
        user.resetPasswordToken = resetTokenHashed;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        //Create reset URL
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        console.log(resetURL);

        // Email message
        const message = `
        <p>You have requested a password reset.</p>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetURL}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
    `;
        // Send email
        await sendEmail(user.email, 'Password Reset Request', message);
        res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
    const { token } = req.query;
    const { newPassword } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        // Hash the token to compare with DB
        const resetTokenHashed = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by reset token and check if token is not expired
        const user = await User.findOne({
            resetPasswordToken: resetTokenHashed,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        // Update user's password
        user.password = await bcrypt.hash(newPassword, salt);; // The pre-save hook will hash this
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        // Optionally, send a confirmation email
        const message = `
            <p>Your password has been successfully reset.</p>
            <p>If you did not perform this action, please contact support immediately.</p>
        `;

        await sendEmail(user.email, 'Password Successfully Reset', message);

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};