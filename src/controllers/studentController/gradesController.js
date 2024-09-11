const Grade = require('../../models/Gradings');
const Module = require('../../models/Module');
const AcademicYear = require('../../models/AcademicYear');

require('dotenv').config();


//Get all grades of a student by student ID
exports.getGradesByStudentId = async (req, res) => {
    const { studentId } = req.query;

    try {

        console.log('studentId', studentId);
        const grades = await Grade.findOne({ studentId: studentId }).populate({
            path: 'gradings.moduleId',
            model: 'Module',  
            select: 'moduleName  semester ',
            populate:{
                path: 'semester',
                model: 'Semester',
                select: 'semesterId academicYear' , 
                populate:{
                    path:'academicYear',  
                    model: 'AcademicYear',
                    select: 'yearNumber',
                                       
                }
            }

        });   
        if (!grades) {
            return res.status(404).json({ msg: 'No grades found for the student' });
        }
        res.json(grades.gradings);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}





