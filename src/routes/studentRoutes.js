const express = require('express');
const verifyJWT = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list');
const router = express.Router();
module.exports = router;
const verifyRole = require('../middleware/verifyRoles');
const { getUserDetails } = require('../controllers/studentController');


router.use(verifyJWT)

router.get('/dashboard',verifyRole(ROLES_LIST.Student), (req, res) => {
    res.send('Student Dashboard');
});

