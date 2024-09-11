const express = require('express');
const verifyJWT = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list');
const router = express.Router();
module.exports = router;
const verifyRole = require('../middleware/verifyRoles');
const { getGradesByStudentId, getModuleNameByModuleId } = require('../controllers/studentController/gradesController');
const{calculateGPAByStudentId , getGradeDistributionByStudentId} = require('../controllers/studentController/gpaController');



router.use(verifyJWT)

router.get('/',verifyRole(ROLES_LIST.Student), (req, res) => {
    res.send('Student Dashboard');
});
router.get('/grades',verifyRole(ROLES_LIST.Student),getGradesByStudentId);
router.get('/gpa',verifyRole(ROLES_LIST.Student),calculateGPAByStudentId);
router.get('/gpa/chart',verifyRole(ROLES_LIST.Student),getGradeDistributionByStudentId);


