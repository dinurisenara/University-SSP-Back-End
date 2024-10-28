const { default: mongoose } = require('mongoose');

const UniResourceRequest = require('../../models/UniResourceRequest');
const UniResource = require('../../models/UniResource');



exports.getResources = async (req, res) => {
    try {
        const { id } = req.query;

        // Log the id being passed to check its value
        console.log('Received resourceOwner ID:', id);

        // Ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid resource owner ID.' });
        }

        const resources = await UniResource.find({ resourceOwner: id });

        // Check if resources array is empty and respond accordingly
        if (!resources || resources.length === 0) {
            return res.status(404).json({ msg: 'No resources found for this owner.' });
        }

        res.json(resources);
    } catch (error) {
        console.error('Error retrieving resources:', error.message);

        // Respond with an error message and status code
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

exports.getResourceRequests = async (req, res) => {
    try {
        const { userId } = req.query;

        // Log the id being passed to check its value
        console.log('Received resource owner id:', userId);

        // Ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: 'Invalid user Id.' });
        }

       // Find all resource requests and populate `resourceId` and `studentId`
       const requests = await UniResourceRequest.find()
       .populate([
           {
               path: 'resourceId',
               select: 'resourceName resourceType availabilityStatus description resourceOwner',
           },
           {
               path: 'studentId',
               model: 'User',
               select: 'fName lName email', // Select desired fields from the student user
           }
       ])
       .lean();

   // Filter out requests where `resourceOwner` doesn’t match `userId`
   const filteredRequests = requests.filter(
       request =>  request.resourceId.resourceOwner.toString() == userId
   );
  

   console.log("Filtered Requests", filteredRequests)
       
       
        res.json(filteredRequests);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

exports.handleResourceRequest = async (req, res) => {
    try {
        const { id, status } = req.query;

        // Log the id and status being passed to check their values
        console.log('Received request ID:', id);
        console.log('Received status:', status);

        // Ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid request ID.' });
        }

        const request = await UniResourceRequest.findById(id);
        console.log(request)
        if (!request) {
            return res.status(404).json({ msg: 'Resource request not found.' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ msg: 'Resource request has already been processed.' });
        }

        request.status = status;
        request.approvalDate = Date.now();
        request.approvedBy = req.user.id;

        await request.save();

        res.status(200).json(request);
    } catch (error) {
        
        res.status(500).send('Server error');
    }
}

exports.changeResourceStatus = async (req, res) => {
    try {
        const { id, status } = req.query;

        // Log the id and status being passed to check their values
        console.log('Received resource ID:', id);
        console.log('Received status:', status);

        // Ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid resource ID.' });
        }

        const resource = await UniResource.findById(id);
        console.log("Resources", resource)

        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found.' });
        }

        if (resource.availabilityStatus === status) {
            return res.status(400).json({ msg: `Resource is already ${status}.` });
        }

        resource.availabilityStatus = status;
        await resource.save();

        res.json({ msg: 'Status updated successfully', resource });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};