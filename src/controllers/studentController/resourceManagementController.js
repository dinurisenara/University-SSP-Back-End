const ResourceRequests = require('./../../models/ResourceRequest');


//Get resource request by student user id
exports.getResourceRequestByStudentId = async (req, res) => {
    const { studentId } = req.query;

    try {
        const requests = await ResourceRequests.find({ studentId: studentId });
        if (!requests) {
            return res.status(404).json({ msg: 'No resource requests found for the student' });
        }
        res.json(requests);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

// Make resource requests 

exports.makeResourceRequests = async (req,res) =>{
    const {studentId , resourceId , requestDate, requestedStartTime ,  requestedEndTime} = req.body ;

try{
     // Check if the requested times are valid
     if (new Date(requestedStartTime) >= new Date(requestedEndTime)) {
        return res.status(400).json({ error: 'Invalid time slot' });
      }

      // Check if the resource is available in the requested time slot
    const existingRequest = await ResourceRequests.findOne({
        resourceId,
        status: 'approved',
        requestedStartTime: { $lt: new Date(requestedEndTime) },
        requestedEndTime: { $gt: new Date(requestedStartTime) },
      });

      if (existingRequest) {
        return res.status(400).json({ error: 'Resource is already booked for the requested time slot' });
      }


    const newRequest = new ResourceRequests({
        studentId,
        resourceId,
        requestDate,
        requestedStartTime,
        requestedEndTime
    });

    await newRequest.save();
    res.status(201).json({ message: 'Resource request created successfully', newRequest });
    
}
catch(error){
    console.error(error.message);
    res.status(500).send('Server error');

}
}
