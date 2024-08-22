const express = require('express');
const verifyJWT = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list');
const router = express.Router();
module.exports = router;
const { getUserDetails } = require('../controllers/userController');



// router.use(verifyJWT)

router.get('/profile',getUserDetails);  