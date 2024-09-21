const { default: mongoose } = require('mongoose');
const Resource = require('../../models/resource');
const ResourceRequests = require('../../models/resourceRequest');


exports.getResources = async (req, res) => {
    try {
        const { id } = req.query;

          // Log the id being passed to check its value
          console.log('Received resourceOwner ID:', id);

           // Ensure the ID is a valid ObjectId
           if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid resource owner ID.' });
        }
        
        const resources = await Resource.find({  resourceOwner: id });
        if (!resources.length) {
            return res.status(404).json({ msg: 'No resources found for this owner.' });
        }

        res.json(resources);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getResourceRequests = async (req, res) => {
    try {
        const { id } = req.query;

        // Log the id being passed to check its value
        console.log('Received resource id:', id);

        // Ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid resource.' });
        }

        const requests = await ResourceRequests.find({ resourceId: id });
        if (!requests.length) {
            return res.status(404).json({ msg: 'No resource requests found for this resource.' });
        }

        res.json(requests);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

exports.handleResourceRequest = async (req, res) => {
    try {
        const { id, status } = req.body;

        // Log the id and status being passed to check their values
        console.log('Received request ID:', id);
        console.log('Received status:', status);

        // Ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid request ID.' });
        }

        const request = await ResourceRequests.findById(id);
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

        res.json(request);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}
