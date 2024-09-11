const Resource = require("../models/Resource");



// GET: Fetch available resources
 exports.getAvailableResources = async (req, res) => {
  try {
    const resources = await Resource.find({ availabilityStatus : "available"}); // Assuming 'active' status for resources
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};


  