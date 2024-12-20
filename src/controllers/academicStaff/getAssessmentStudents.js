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

    try {
        // Fetch the moduleId from the assessment
        const assessment = await Assessment.findById(assessmentId).populate({
            path: 'moduleId',
            select: 'semester'
        });
        if (!assessment || !assessment.moduleId) {
            return res.status(404).json({ error: 'Assessment not found or missing moduleId' });
        }
    

       

        // Find students in the semester
        const studentsPromise = User.find({ semester: assessment.moduleId.semester}).lean();

        // Find grades for the assessment
        const gradesPromise = AssessmentGrades.find({ assessmentId: assessmentId }).lean();

        // Execute both promises concurrently
        const [students, grades] = await Promise.all([studentsPromise, gradesPromise]);

        console.log(students);
        console.log(grades);
        // Return students and grades
        res.status(200).json({ students, grades });
        
    } catch (error) {
        // Send a detailed error message
        res.status(500).json({ error: error.message });
    }
}
