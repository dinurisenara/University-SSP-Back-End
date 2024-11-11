const Class = require('./../../models/Class');
const User = require('./../../models/User');
const ClassSchedule = require('../../models/ClassSchedule');
const uniResource = require('../../models/UniResource');

//Get classes for an academic Staff MEmeber

exports.getClasses = async (req, res) => {
    const { academicStaffId } = req.query;

    if (!academicStaffId) {
        return res.status(400).json({ error: 'Academic Staff ID is required' });
    }
    console.log("Controller for class", academicStaffId);

    try {
        const classes = await Class.find({ academicStaff: academicStaffId })
            .populate([{
                path: 'academicStaff',
                model: 'User',
                select: ['fName', 'lName']
            }, {
                path: 'semesterId', // Correct the path name to match the schema field
                model: 'Semester',
                select: 'semesterId'
            }, {
                path: 'moduleId', // Correct the path name to 'moduleId'
                model: 'Module',
                select: 'moduleName'
            }, {
                path: 'location', // Assuming 'location' is the correct field name in your schema
                model: 'UniResource',
                select: 'resourceName'
            }, {
                path: 'students',
                model: 'User',  // Assuming that the students are stored in the 'User' model
                select: ['fName', 'lName', 'userId'] // Populate the fName and lName of each student
            }]);
        console.log("Classes:", classes);

        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};

//Change the fixed schedule for a class
exports.changeFixedSchedule = async (req, res) => {
    const { classId } = req.query;
    const { dayOfWeek, startTime, endTime } = req.body;

    if (!classId || !dayOfWeek || !startTime || !endTime) {
        return res.status(400).json({ error: 'Class ID, day of week, start time, and end time are required' });
    }

    try {
        const updatedClass = await Class.findByIdAndUpdate(classId, { 'fixedSchedule.dayOfWeek': dayOfWeek, 'fixedSchedule.startTime': startTime, 'fixedSchedule.endTime': endTime }, { new: true });
        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update fixed schedule' });
    }
}


// get extra schedulesfor a class

exports.getExtraSchedules = async (req, res) => {
    const { academicStaffId } = req.query;

    if (!academicStaffId) {
        return res.status(400).json({ error: 'Academic Staff ID is required' });
    }

    try {
        console.log("Academic Staff ID:", academicStaffId);

        // Find classes associated with the specified academic staff
        const classes = await Class.find({ academicStaff: academicStaffId });

        if (classes.length === 0) {
            return res.status(404).json({ message: 'No classes found for the specified academic staff.' });
        }

        // Find extra schedules for the specified academic staff in the found classes
        const extraSchedules = await ClassSchedule.find({
            classId: { $in: classes.map(cls => cls._id) } // Match classIds from found classes
        })
            .populate({
                path: 'classId',
                model: 'Class',
                select: ['className', 'classId', 'moduleId', 'semesterId', 'description', 'fixedSchedule'] // Include fields you need
            })
            .populate({
                path: 'location', // Populate location for extra schedules
                model: 'UniResource', // Assuming you have a Resource model
                select: ['resourceName'] // Select relevant fields from Resource model
            });

        

        // Check if schedules are found
        if (extraSchedules.length === 0) {
            return res.status(404).json({ message: 'No extra schedules found for the specified academic staff.' });
        }

        // Return the found extra schedules
        res.json(extraSchedules);
    } catch (error) {
        console.error("Error fetching extra schedules:", error);
        res.status(500).json({ error: 'Failed to fetch extra schedules' });
    }
};

// add extra schedule for a class
exports.addExtraSchedule = async (req, res) => {
    const { classId, startTime, endTime, location } = req.body;

    if (!classId || !startTime || !endTime || !location) {
        return res.status(400).json({ error: 'Class ID, date, start time, end time, and location are required' });
    }

    try {
        const newExtraSchedule = new ClassSchedule({ classId, startTime, endTime, location });
        await newExtraSchedule.save();
        res.json(newExtraSchedule);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add extra schedule' });
    }
};

// delete extra schedule for a class
exports.deleteExtraSchedule = async (req, res) => {
    const { extraScheduleId } = req.query;

    if (!extraScheduleId) {
        return res.status(400).json({ error: 'Extra schedule ID is required' });
    }

    try {
        await ClassSchedule.findByIdAndDelete(extraScheduleId);
        res.json({ message: 'Extra schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete extra schedule' });
    }
};

// update extra schedule for a class
exports.updateExtraSchedule = async (req, res) => {
    const { extraScheduleId } = req.query;
    const { startTime, endTime, location } = req.body;

    if (!extraScheduleId || !startTime || !endTime || !location) {
        return res.status(400).json({ error: 'Extra schedule ID, date, start time, end time, and location are required' });
    }

    try {
        const updatedExtraSchedule = await ClassSchedule.findByIdAndUpdate(extraScheduleId, { startTime, endTime, location }, { new: true });
        res.json(updatedExtraSchedule);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to update extra schedule' });
    }
};


// get locations for a class   for a given time 

exports.getLocations = async (req, res) => {
    const { date, startTime, endTime } = req.query;

    if (!date || !startTime || !endTime) {
        return res.status(400).json({ error: 'Date, start time, and end time are required' });
    }

    try {
        const locations = await uniResource.find({ resourceType: 'Lab' });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch locations' });
    }


}





// Get schedule details for a specific class by classId
exports.getClassScheduleDetails = async (req, res) => {
    const { classId } = req.query;

    try {
        const scheduleDetails = await ClassSchedule.find({ classId })


        if (!scheduleDetails.length) {
            return res.status(404).json({ message: 'No schedule found for this class' });
        }
        console.log(scheduleDetails);
        res.status(200).json(scheduleDetails);
    } catch (error) {
        console.error('Error fetching class schedule details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// get class details by class Id
exports.getClassDetails = async (req, res) => {
    const { classId } = req.query;
    console.log("ClassId" ,classId);
    try {
        const classDetails = await Class.findById(classId)
            .populate({ path: 'academicStaff', model: 'User', select: ['fName', 'lName'] })
            .populate({ path: 'students', model: 'User', select: ['fName', 'lName', 'userId'] })
            .populate({ path: 'location', model: 'UniResource', select: ['resourceName'] })
            .populate('moduleId', ['moduleName'])
            .populate('semesterId', ['semesterId']);
  
        if (!classDetails) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.json(classDetails);
        console.log("Class Details",classDetails);
    } catch (error) {
        console.error('Error fetching class details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



