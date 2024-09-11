const { default: mongoose } = require('mongoose');
const Resource = require('../../models/resource');


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
