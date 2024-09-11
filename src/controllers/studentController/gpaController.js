const Grade = require('../../models/Gradings');


// Function to map percentage to GPA
const percentageToGPA = (grade) => {
  if (grade >= 90) return 4.0;
  if (grade >= 80) return 3.0;
  if (grade >= 70) return 2.0;
  if (grade >= 60) return 1.0;
  return 0.0;
};

// Controller to calculate GPA based on student grades
exports.calculateGPAByStudentId = async (req, res) => {
  const { studentId } = req.query;

  try {
      // Fetch student grades
      const grades = await Grade.findOne({ studentId: studentId }).populate({
          path: 'gradings.moduleId',
          model: 'Module',  
          select: 'moduleName semester ',
         
      });

      if (!grades) {
          return res.status(404).json({ msg: 'No grades found for the student' });
      }

      // Calculate GPA
      let totalGPA = 0;
      let numModules = grades.gradings.length;

      grades.gradings.forEach(grading => {
          const gradePercentage = grading.grade;
          const gpa = percentageToGPA(gradePercentage); // Convert percentage to GPA
          totalGPA += gpa;
      });

      const averageGPA = totalGPA / numModules;

      

      res.json({
          studentId,
          gpa: averageGPA.toFixed(2) // Returning GPA with 2 decimal points
      });
      console.log(averageGPA.toFixed(2));
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
  }
};




// Function to categorize grades
const categorizeGrade = (grade) => {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
};

// Controller to calculate grade distribution for pie chart
exports.getGradeDistributionByStudentId = async (req, res) => {
  const { studentId } = req.query;

  try {
      // Fetch student grades
      const grades = await Grade.findOne({ studentId: studentId }).populate({
          path: 'gradings.moduleId',
          model: 'Module',
          select: 'moduleName semester',
          
      });

      if (!grades) {
          return res.status(404).json({ msg: 'No grades found for the student' });
      }

      // Initialize grade categories with arrays for module names
      const gradeDistribution = {
        A: { count: 0, modules: [] },
        B: { count: 0, modules: [] },
        C: { count: 0, modules: [] },
        D: { count: 0, modules: [] },
        F: { count: 0, modules: [] }
    };

      // Categorize grades and store module names
      grades.gradings.forEach(grading => {
        const category = categorizeGrade(grading.grade);
        gradeDistribution[category].count++;
        gradeDistribution[category].modules.push(grading.moduleId.moduleName);
    });


      res.json(gradeDistribution);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
  }
};