const express = require('express');
const router = express.Router();
const authController = require ('../controllers/authController')  



router.post('/register', authController.register);
router.post('/send-otp', authController.sendOtp);    
router.post('/verify-otp',authController.verifyOtp);  
router.post('/login',authController.login);  
router.get('/refresh',authController.refresh)
router.post('/logout',authController.logout); 
router.post('/forgot-password',authController.forgotPassword);
router.post('/reset-password',authController.resetPassword);
module.exports = router;