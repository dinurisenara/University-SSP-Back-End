const Class = require('./../../models/Class');
const User = require('./../../models/User');
const ClassSchedule = require('../../models/ClassSchedule');

//Get classes for an academic Staff MEmeber

exports.getClasses = async (req, res) => {
    const { academicStaffId } = req.query;
    
    if (!academicStaffId) {
        return res.status(400).json({ error: 'Academic Staff ID is required' });
    }
    
    try {
        const classes = await Class.find({ academicStaff: academicStaffId.populate('academicStaff') });
        console.log(classes)
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
        const { classId } = req.query;
        
        if (!classId) {
            return res.status(400).json({ error: 'Class ID is required' });
        }
        
        try {
            const extraSchedules = await ClassSchedule.find({ classId });
            res.json(extraSchedules);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch extra schedules' });
        }
        };

        // add extra schedule for a class
        exports.addExtraSchedule = async (req, res) => {
            const { classId,  startTime, endTime, location } = req.body;
            
            if (!classId  || !startTime || !endTime || !location) {
                return res.status(400).json({ error: 'Class ID, date, start time, end time, and location are required' });
            }
            
            try {
                const newExtraSchedule = new ClassSchedule({ classId,  startTime, endTime, location });
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
                    const {  startTime, endTime, location } = req.body;
                    
                    if (!extraScheduleId  || !startTime || !endTime || !location) {
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
                    

                    
