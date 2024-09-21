const express = require('express');
const verifyJWT = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');
const{getClasses,changeFixedSchedule,getExtraSchedules,addExtraSchedule, deleteExtraSchedule,updateExtraSchedule} = require('./../controllers/academicStaff/classController');
const router = express.Router(); 

router.use(verifyJWT);

router.get('/classes',verifyRole(ROLES_LIST.Academic_Staff),getClasses);
router.put('/classes/fixed-schedule',verifyRole(ROLES_LIST.Academic_Staff),changeFixedSchedule);
router.get('/classes/extra-schedules',verifyRole(ROLES_LIST.Academic_Staff),getExtraSchedules);
router.post('/classes/extra-schedules',verifyRole(ROLES_LIST.Academic_Staff),addExtraSchedule);
router.delete('/classes/extra-schedules',verifyRole(ROLES_LIST.Academic_Staff),deleteExtraSchedule);
router.put('/classes/extra-schedules',verifyRole(ROLES_LIST.Academic_Staff),updateExtraSchedule);


module.exports = router;