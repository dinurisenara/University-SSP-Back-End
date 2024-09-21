const Student = require('../../models/User');
const AcademicYear = require('../../models/AcademicYear');

require('dotenv').config();

// Show a Chart of the student count of each year

exports.getStudentCountbyAcademicYear = async (req, res) => {
    try {
        // Step 1: Find all users and populate the 'semester' and 'academicYear' fields
        const users = await Student.find({type:1984})
            .populate({
                path: 'semester', // Populate the semester field
                model: 'Semester',
                populate: { path: 'academicYear', model: 'AcademicYear', select: 'yearNumber' } // Nested populate to get academicYear details
            })
            .exec();

            console.log(users);
    
        // Step 2: Count the number of students in each academic year
        const studentCount = users.reduce((acc, user) => {
            const yearNumber = user?.semester?.academicYear?.yearNumber;
    
            if (!acc[yearNumber]) {
                acc[yearNumber] = 0;
            }
            acc[yearNumber]++;
            return acc;
        }, {});
        console.log(studentCount);
    
        // Step 3: Format the result for the response
        const result = Object.keys(studentCount).map(year => ({
            _id: Number(year), // The academic year number
            count: studentCount[year] // The number of students in that year
        })).sort((a, b) => a._id - b._id); // Sort by yearNumber
    
        res.json(result); // Return the student count grouped by academic year
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
    
}