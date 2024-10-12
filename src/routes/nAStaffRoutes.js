const express = require('express');
const verifyJWT = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list');
const router = express.Router();

const verifyRole = require('../middleware/verifyRoles');
const { getStudentCountbyAcademicYear } = require('../controllers/naStaffController/getStudentCount.js');
const { getResources , getResourceRequests , handleResourceRequest ,  } = require('../controllers/naStaffController/getResources.js');
const { getInactiveUsers, toggleAccountStatus, sendActivationEmail } = require('../controllers/naStaffController/admissionController.js');


router.use(verifyJWT)

router.get('/student-Count',verifyRole(ROLES_LIST.NAcademicStaff),getStudentCountbyAcademicYear);
router.get('/get-resources',verifyRole(ROLES_LIST.NAcademicStaff),getResources);   
router.get('/resource-requests',verifyRole(ROLES_LIST.NAcademicStaff),getResourceRequests);
router.post('/handle-resource-requests',verifyRole(ROLES_LIST.NAcademicStaff),handleResourceRequest);


//Asmission department routes
router.get('/admission/view-new-admissions',verifyRole(ROLES_LIST.NAcademicStaff),getInactiveUsers);
router.post('/admission/toggle-account-status',verifyRole(ROLES_LIST.NAcademicStaff),toggleAccountStatus);



module.exports = router;