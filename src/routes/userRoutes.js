const express = require('express');
const verifyJWT = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list');
const router = express.Router();
module.exports = router;
const { getUserDetails } = require('../controllers/userController');
const { getAvailableResources } = require('../controllers/resourceManagementController');



router.use(verifyJWT)

router.get('/profile',getUserDetails);  
router.get('/resources/available', getAvailableResources);    // Fetch available resources    