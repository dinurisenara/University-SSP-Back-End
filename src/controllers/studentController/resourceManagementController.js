const UniResourceRequest = require('../../models/UniResourceRequest');



//Get resource request by student user id
exports.getResourceRequestByStudentId = async (req, res) => {
    console.log(req.params);
    console.log(req.query);
    const { studentId } = req.query;
    console.log(studentId);

    try {
        const resourceRequests = await  UniResourceRequest.find({studentId: studentId}).populate('resourceId').exec();
        
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
        // Check if the requested times are valid
        if (new Date(requestedStartTime) >= new Date(requestedEndTime)) {
            return res.status(400).json({ error: 'Invalid time slot' });
        }

        // Check if the resource is available in the requested time slot
        const existingRequest = await UniResourceRequest.findOne({
            resourceId,
            status: 'approved',
            requestedStartTime: { $lt: new Date(requestedEndTime) },
            requestedEndTime: { $gt: new Date(requestedStartTime) },
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'Resource is already booked for the requested time slot' });
        }


        const newRequest = new UniResourceRequest({
            studentId,
            resourceId,
            requestDate,
            requestedStartTime,
            requestedEndTime
        });

        await newRequest.save();
        res.status(201).json({ message: 'Resource request created successfully', newRequest });

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');

    }
}
