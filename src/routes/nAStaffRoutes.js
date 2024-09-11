const express = require('express');
const verifyJWT = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list');
const router = express.Router();
module.exports = router;
const verifyRole = require('../middleware/verifyRoles');
const { getStudentCountbyAcademicYear } = require('../controllers/naStaffController/getStudentCount.js');
const { getResources } = require('../controllers/naStaffController/getResources.js');

router.use(verifyJWT)

router.get('/student-Count',verifyRole(ROLES_LIST.NAcademicStaff),getStudentCountbyAcademicYear);
router.get('/get-resources',verifyRole(ROLES_LIST.NAcademicStaff),getResources);   
