
const AssessmentGrades = require('../../models/AssessmentGrades');


exports.getAssessmentGrades = async (req,res ) =>{
    try{
        const {studentId} = req.query;
        const assessmentGrade = await AssessmentGrades.find({studentId:studentId})
        .populate({
            path: 'assessmentId',
            model: 'Assessment',
            select: 'name type moduleId',
            populate: {
              path: 'moduleId',
              model: 'Module',
              select: 'moduleName',
            },
          });
        if(!assessmentGrade){
            return res.status(404).json({msg: 'No grades found for the student'});
        }
        res.json(assessmentGrade);


    }catch(error){
        console.error(error.message);
        res.status(500).send('Server error');
    }
}