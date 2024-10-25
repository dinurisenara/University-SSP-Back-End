const UniResourceRequest = require('../../models/UniResourceRequest');



//Get resource request by student user id
exports.getResourceRequestByStudentId = async (req, res) => {
    console.log(req.params);
    console.log(req.query);
    const { studentId } = req.query;
    console.log(studentId);

    try {
        const resourceRequests = await UniResourceRequest.find({ studentId: studentId }).populate('resourceId').exec();

        console.log(resourceRequests);
        if (!resourceRequests) {
            return res.status(404).json({ msg: 'No resource requests found for the student' });
        }

        res.json(resourceRequests);

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

// Make resource requests 

exports.makeResourceRequests = async (req, res) => {
    const { studentId, resourceId, requestDate, requestedStartTime, requestedEndTime } = req.body;

    try {

        // Create Date objects from the incoming request
        const requestDateObject = new Date(requestDate); // This should be in UTC
        const requestedStartTimeObject = new Date(requestedStartTime);
        const requestedEndTimeObject = new Date(requestedEndTime);

        // Extract date components from requestDateObject
        const year = requestDateObject.getUTCFullYear();
        const month = requestDateObject.getUTCMonth();
        const day = requestDateObject.getUTCDate();
        
        // Extract time components from requestedStartTimeObject
        const startHours = requestedStartTimeObject.getUTCHours();
        const startMinutes = requestedStartTimeObject.getUTCMinutes();
        const startSeconds = requestedStartTimeObject.getUTCSeconds();
        
        // Create a new startTime object by combining date and start time
        const startTime = new Date(Date.UTC(year, month, day, startHours, startMinutes, startSeconds));
        
        // Extract time components from requestedEndTimeObject
        const endHours = requestedEndTimeObject.getUTCHours();
        const endMinutes = requestedEndTimeObject.getUTCMinutes();
        const endSeconds = requestedEndTimeObject.getUTCSeconds();
        
        // Create a new endTime object by combining date and end time
        const endTime = new Date(Date.UTC(year, month, day, endHours, endMinutes, endSeconds));        

        // Validate the created Date objects
        if (isNaN(startTime) || isNaN(endTime)) {
            return res.status(400).json({ error: 'Invalid date or time format' });
        }

        // Check if the requested start time is earlier than the end time
        if (startTime >= endTime) {
            return res.status(400).json({ error: 'Invalid time slot: start time must be before end time' });
        }

        // Check if the resource is available in the requested time slot
        const existingRequest = await UniResourceRequest.findOne({
            resourceId,
            status: 'approved',
            $and: [
                // Scenario 1: Existing request fully contains the new request
                {
                    requestedStartTime: { $lte: new Date(requestedStartTime) },
                    requestedEndTime: { $gte: new Date(requestedEndTime) }
                },
                // Scenario 2: Existing request is fully contained within the new request
                {
                    requestedStartTime: { $gte: new Date(requestedStartTime) },
                    requestedEndTime: { $lte: new Date(requestedEndTime) }
                },
                // Scenario 3: Existing request starts before and ends during the new request
                {
                    requestedStartTime: { $lt: new Date(requestedStartTime) },
                    requestedEndTime: { $gt: new Date(requestedStartTime), $lt: new Date(requestedEndTime) }
                },
                // Scenario 4: Existing request starts during and ends after the new request
                {
                    requestedStartTime: { $gt: new Date(requestedStartTime), $lt: new Date(requestedEndTime) },
                    requestedEndTime: { $gt: new Date(requestedEndTime) }
                }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'Resource is already booked for the requested time slot' });
        }


        const newRequest = new UniResourceRequest({
            studentId,
            resourceId,
            requestDate,
            requestedStartTime : startTime,
            requestedEndTime : endTime,
        });

        await newRequest.save();
        res.status(201).json({ message: 'Resource request created successfully', newRequest });

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');

    }
}
