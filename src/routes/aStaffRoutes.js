const express = require('express');
const verifyJWT = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');
const{getClasses,changeFixedSchedule,getExtraSchedules,addExtraSchedule, deleteExtraSchedule,updateExtraSchedule} = require('./../controllers/academicStaff/classController');

const { setAssessment, getAssesments } = require('../controllers/academicStaff/AssessmentController');
const { setAssessmentGrade } = require('../controllers/academicStaff/AssessmentGradeControlller');
const { getAssessmentStudents } = require('../controllers/academicStaff/getAssessmentStudents');
const { getModulesForAssessment, getAssessingStaffMembers } = require('../controllers/academicStaff/AddAssessmentController');
const router = express.Router(); 

router.use(verifyJWT);   

router.get('/classes',verifyRole(ROLES_LIST.Academic_Staff),getClasses);
router.put('/classes/change-fixed-schedule',verifyRole(ROLES_LIST.Academic_Staff),changeFixedSchedule);
router.get('/classes/extra-schedules',verifyRole(ROLES_LIST.Academic_Staff),getExtraSchedules);
router.post('/classes/extra-schedules',verifyRole(ROLES_LIST.Academic_Staff),addExtraSchedule);
router.delete('/classes/extra-schedules',verifyRole(ROLES_LIST.Academic_Staff),deleteExtraSchedule);
router.put('/classes/extra-schedules',verifyRole(ROLES_LIST.Academic_Staff),updateExtraSchedule);
router.post('/assessments/add-assessment',verifyRole(ROLES_LIST.Academic_Staff),setAssessment);
router.get('/assessments/get-assessments',verifyRole(ROLES_LIST.Academic_Staff),getAssesments);
router.post('/assessments/add-grade',verifyRole(ROLES_LIST.Academic_Staff),setAssessmentGrade);
router.get('/assessments/get-students',verifyRole(ROLES_LIST.Academic_Staff),getAssessmentStudents);
router.get('/assessments/get-modules-for-assessment',verifyRole(ROLES_LIST.Academic_Staff),getModulesForAssessment);
router.get('/assessments/get-assessing-staff-members',verifyRole(ROLES_LIST.Academic_Staff),getAssessingStaffMembers);

module.exports = router;