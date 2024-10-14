const Assessment = require("../../models/Assessment");
const Grade = require("../../models/Gradings");
const AssessmentGrades = require("../../models/AssessmentGrades");
const User = require("../../models/User");



exports.setAssessmentGrade = async (req, res) => {
    const { assessmentId, studentId, achievedMarks } = req.body;

    if (!assessmentId || !studentId || !achievedMarks) {
        return res.status(400).json({ error: 'Assessment ID, student ID, and grade are required' });
    }  
  
    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });    
                     
        }

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const existingGrade = await AssessmentGrades.findOne({ assessmentId, studentId });
        let newAssessmentGrade;
        let previousGrade ;
        if (existingGrade) {
            
        // Update the assessment grade
        previousGrade = existingGrade.achievedMarks;
        existingGrade.achievedMarks = achievedMarks;
        await existingGrade.save();
            newAssessmentGrade = existingGrade;
        }
        else{

        // Insert the new assessment grade
         newAssessmentGrade = new AssessmentGrades({ assessmentId, studentId, achievedMarks });
        await newAssessmentGrade.save();
        }
        // Update the module grade based on the assessment weightage
        const weightage = assessment.weightage; // Assuming the assessment has a weightage field
        const moduleId = assessment.moduleId; // Assuming the assessment is tied to a module

        const updatedModuleGrade = await updateModuleGrades(achievedMarks, weightage, studentId, moduleId , previousGrade);
        
        if (updatedModuleGrade) {
            res.json({ newAssessmentGrade, updatedModuleGrade });
        } else {
            res.status(500).json({ error: 'Failed to update module grade' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add assessment grade' });
    }
}

//Function to updte ethe modules grades with the assessment grade weightage

async function updateModuleGrades(assessmentMark , weightage , studentId , moduleId, previousGrade){
    try{
        const { gradeDocument, moduleGrade } = await getModuleGrade(studentId, moduleId);
    
        if(!moduleGrade){
            console.log('Module grade not found.');
            return null;
        }
        if(previousGrade){
            // Update the grade using the assessment mark and weightage
            moduleGrade.grade -= (previousGrade * (weightage/100));
        }
        
         // Update the grade using the assessment mark and weightage
         moduleGrade.grade += (assessmentMark * (weightage/100));

         // Save the updated grade document
        await gradeDocument.save();
        return moduleGrade;  // Return the updated module grade
    }
    catch(error){
        console.log('Error updating module grade:', error);
        return null;
    }
}
   
      
      

// Function to get a particular module grade for a student
async function getModuleGrade(studentId, moduleId) {
    try {
      // Find the student grade and the specific module's grade using $elemMatch
      const gradeDocument = await Grade.findOne({
        studentId: studentId,
        gradings: { 
          $elemMatch: { moduleId: moduleId } 
        }
    
      });
  
      if (gradeDocument) {
        const moduleGrade = gradeDocument.gradings.find(grading => grading.moduleId.toString() === moduleId.toString());
        return { gradeDocument, moduleGrade };
      } 
      else {
        // If no grade document found, create a new one
        console.log('No grade found for the specified student and module. Creating a new grade document.');

        const newGradeDocument = new Grade({ 
            studentId: studentId,
            gradings: [{
                moduleId: moduleId,
                grade: 0,
                gradeDate:new Date(), // Set default value or leave it to be updated later
                // Add other necessary fields here, such as weightage or total marks if needed
            }]
        });

        await newGradeDocument.save(); // Save the new grade document
        return { gradeDocument: newGradeDocument, moduleGrade: newGradeDocument.gradings[0] };
      }
    } catch (error) {
      console.error('Error fetching module grade:', error);
      return null;
    }
  }

