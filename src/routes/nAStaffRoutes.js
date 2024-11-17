const express = require('express');
const verifyJWT = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list');
const router = express.Router();

const verifyRole = require('../middleware/verifyRoles');
const { getStudentCountbyAcademicYear } = require('../controllers/naStaffController/getStudentCount.js');
const { getResources , getResourceRequests , handleResourceRequest, changeResourceStatus ,  } = require('../controllers/naStaffController/getResources.js');
const { getInactiveUsers, toggleAccountStatus, sendActivationEmail, deactivateAccount, getActiveUsers } = require('../controllers/naStaffController/admissionController.js');


router.use(verifyJWT)

router.get('/student-Count',verifyRole(ROLES_LIST.NAcademicStaff),getStudentCountbyAcademicYear);
router.get('/get-resources',verifyRole(ROLES_LIST.NAcademicStaff),getResources);   
router.get('/resource-requests',verifyRole(ROLES_LIST.NAcademicStaff),getResourceRequests);
router.put('/resources/changeStatus',verifyRole(ROLES_LIST.NAcademicStaff),changeResourceStatus);
router.put('/handle-resource-requests',verifyRole(ROLES_LIST.NAcademicStaff),handleResourceRequest);


//Asmission department routes
router.get('/admission/view-new-admissions',verifyRole(ROLES_LIST.NAcademicStaff),getInactiveUsers);
router.put('/admission/toggle-account-status',verifyRole(ROLES_LIST.NAcademicStaff),toggleAccountStatus);
router.get('/admission/view-active-admissions', verifyRole(ROLES_LIST.NAcademicStaff),getActiveUsers)
router.put('/admission/deactivate-account',verifyRole(ROLES_LIST.NAcademicStaff), deactivateAccount);




module.exports = router;