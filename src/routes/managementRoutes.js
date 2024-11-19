const express = require('express');

const verifyJWT = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');
const { getUserTypeCount , getStudentCourseCount , getNonAcademicStaffDepartmentCount,getStudentAcademicYearCount } = require('../controllers/managementController');
const router = express.Router();
router.use(verifyJWT);

router.get('/user-type-count', verifyRole(ROLES_LIST.Management), getUserTypeCount);
router.get('/student-course-count', verifyRole(ROLES_LIST.Management), getStudentCourseCount);
router.get('/student-academic-year-count', verifyRole(ROLES_LIST.Management), getStudentAcademicYearCount);
router.get('/non-academic-staff-department-count', verifyRole(ROLES_LIST.Management), getNonAcademicStaffDepartmentCount);


module.exports = router;