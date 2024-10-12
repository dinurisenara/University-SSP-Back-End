const User = require("../../models/User");
const Semester = require("../../models/Semester");
const Module =   require("../../models/Module");
const Assessment = require("../../models/Assessment");
const AssessmentGrades = require("../../models/AssessmentGrades");

exports.getAssessmentStudents = async (req, res) => {
    const { assessmentId } = req.query;

    if (!assessmentId) {
        return res.status(400).json({ error: 'Assessment ID is required' });
    }

   try{
    
    const moduleId = await Assessment.findById(assessmentId).select('moduleId');
    const semester = await Semester.find({modules: moduleId});
    const students = await  User.find({semester:semester});
    const grades = await AssessmentGrades.find({AssessmentId: assessmentId});

    const data = {
        students : students,
        grades   : grades      
    }

    res.status(200).json(data);

   }catch(error){
    res.error(500).json({error: error.message});
   }
}
