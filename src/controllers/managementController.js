const User = require('../models/User');

exports.getUserTypeCount = async (req, res) => {
    try {
        console.log('Fetching user type count');
        const userTypeCount = await User.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } },
        ]);
        res.json(userTypeCount);
    } catch (error) {
        console.error('Error fetching user type count:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getStudentCourseCount = async (req, res) => {
    try {
        const courseCount = await User.aggregate([
            {
                $match: { type: 1984 }, // Match only students
            },
            {
                $group: {
                    _id: '$course', // Group by course
                    count: { $sum: 1 }, // Count students in each course
                },
            },
            {
                $lookup: {
                    from: 'courses', // The name of the course collection in MongoDB
                    localField: '_id', // Field from the aggregation result to join on
                    foreignField: '_id', // Field in the course collection to join with
                    as: 'courseDetails', // The name of the output array field
                },
            },
            {
                $unwind: '$courseDetails', // Unwind the courseDetails array
            },
            {
                $project: {
                    _id: 1, // Keep the course ID
                    count: 1, // Keep the count
                    courseName: '$courseDetails.courseName', // Include the course name
                },
            },
        ]);

        res.json(courseCount);
    } catch (error) {
        console.error('Error fetching student course count:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};



exports.getStudentAcademicYearCount = async (req, res) => {
    try {
        const academicYearCount = await User.aggregate([
            {
                $match: { type: 1984 }, // Match only students
            },
            {
                $group: {
                    _id: '$academicYear', // Group by academicYear field
                    count: { $sum: 1 }, // Count students in each academic year
                },
            },
            {
                $lookup: {
                    from: 'academicyears', // Match the collection name in MongoDB (default is pluralized and lowercase)
                    localField: '_id', // Field from the aggregation result
                    foreignField: '_id', // Field in the AcademicYear collection
                    as: 'academicYearDetails', // The name of the output array field
                },
            },
            {
                $unwind: {
                    path: '$academicYearDetails',
                    preserveNullAndEmptyArrays: true, // Optional: If you want to include students without an academic year
                },
            },
            {
                $project: {
                    _id: 1, // Keep the academic year ID
                    count: 1, // Keep the count
                    year: '$academicYearDetails.yearNumber', // Include the academic year number
                },
            },
        ]);

        console.log(academicYearCount);
        res.json(academicYearCount);
    } catch (error) {
        console.error('Error fetching student academic year count:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


exports.getNonAcademicStaffDepartmentCount = async (req, res) => {
    try {
        const departmentCount = await User.aggregate([
            { $match: { type: 2002 } }, // Only non-academic staff
            { $group: { _id: '$department', count: { $sum: 1 } } },
        ]);
        res.json(departmentCount);
    } catch (error) {
        console.error('Error fetching non-academic staff department count:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
