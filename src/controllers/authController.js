require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/Otp')
const nodemailer =  require('nodemailer');
const asyncHandler = require('express-async-handler');
const ROLES_LIST = require('../config/roles_list');
const { v4: uuidv4 } = require('uuid'); 
const Course = require('../models/Course');


// Register a new user

exports.register = async(req,res) =>{
    const {firstName , lastName , email , password , mobile , type, course} = req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg: 'User already exists'});
        }
        
        const salt = await bcrypt.genSalt(10);

        const role = ROLES_LIST[type.replace(/\s+/g, '_')];
 // Dynamically assign role based on the provided type

    
        const hashedPassword = await bcrypt.hash(password, salt);

       
 
const enrolledCourse = role == 1984 ? await Course.findOne({courseId : course}).select('_id').lean() : null;
const prefix = enrolledCourse ? course : (role == 2002 ?  'NA': (role == 2001 && 'AS'));

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
            password: hashedPassword ,
            mobile: mobile,
            type: role,
            course: enrolledCourse
        
        });

        await user.save();

       res.json({msg: 'User registered successfully'});

    }catch(error){
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Email verification 


//Email configuration 
const transporter = nodemailer.createTransport({
 service:'Gmail',
 auth:{
    user:process.env.EMAIL,
    pass:process.env.EMAIL_PASSWORD
 }
});


//Generate and send OTP

exports.sendOtp = async(req,res)=>{
    const {email} = req.body;

    try{
        

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newOtp = new Otp({
            email: email ,
            otp
        })

        await newOtp.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for password reset',
            text: `Your OTP is ${otp}`
        };

        transporter.sendMail(mailOptions , (error, info)=>{
            if(error){
                return res.status(500).json({msg:'Server Error'});
            }
            res.json({msg:'Otp sent'});
        });      

    }catch(error){
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


//Verify OTP 

exports.verifyOtp = async(req,res) =>{
    const {email , otp } = req.body;

    try{       

        const validOtp = await Otp.findOne({email: email, otp});
        if(!validOtp){
            return res.status(400).json({msg: 'Invalid OTP'});
        }
        

        await Otp.deleteOne({_id: validOtp.id});//Remove the used OTP

        const payload ={
            user: {
                email: email,                
            }
        };

        return res.status(200).json({msg: ' verified', payload});

   
    }
    catch(error){
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
        console.log("user matching the user ID" , user);
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
        res.status(500).send('Server error');
    }
};


exports.refresh = async (req,res) =>{ 
   const cookies = req.cookies
   
   if(!cookies.jwt){
       return res.status(401).json({msg:'Unauthorized'});

   }
   const refreshToken = cookies.jwt;

    jwt.verify(
    refreshToken,process.env.REFRESH_SECRET,
    asyncHandler(async(error,decoded)=>{
        if (error){
            return res.status(403).json({msg:'Forbidden'});
        }
        const foundUser = await User.findOne({email:decoded.user.email});
        if(!foundUser){
            return res.status(401).json({msg:'Unauthorized'});
        }

        const accessToken = jwt.sign(
            {
                user:{
                    email:foundUser.email,
                    id:foundUser._id,
                    userId:foundUser.userId,
                    type:foundUser.type
                },
 
            
            }, process.env.JWT_SECRET,{expiresIn:'1h'}
        )

        res.json({accessToken});
    })
   )
}

exports.logout = async(req,res) =>{
    const cookies = req.cookies;
    if(!cookies.jwt){
        return res.status(204) // No content
    }
        res.clearCookie('jwt',{httpOnly:true,secure:true,sameSite:'none'});
        res.json({msg:'Logged out'});
    
}