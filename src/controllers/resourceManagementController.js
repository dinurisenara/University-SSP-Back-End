const UniResource = require("../models/UniResource");
const Resource = require("./../models/Resource");
const ResourceRequest = require("./../models/ResourceRequest");




// GET: Fetch available resources
exports.getAvailableResources = async (req, res) => {
  try {
    const resources = await UniResource.find({ availabilityStatus: "available" }); // Assuming 'active' status for resources
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

// Helper function to generate time slots
const generateTimeSlots = (start, end) => {
  const slots = [];
  let currentTime = start;

  while (currentTime < end) {
    const nextTime = currentTime + 1; // Assuming time slots are 1 hour apart
    slots.push(`${currentTime}:00 - ${nextTime}:00`);
    currentTime = nextTime;
  }

  return slots;
};

// Get available time slots for a resource

exports.getAvailableTimeSlots = async (req, res) => {
  const { resourceId, date } = req.query;

  if (!resourceId || !date) {
    return res.status(400).json({ error: 'Resource ID and date are required' });
  }

  try {

    console.log("Date", date);

    // Convert the date to a Date object for querying
    const requestedDate = new Date(date);
    console.log("REquested Date", requestedDate);

    const startOfDay = new Date(requestedDate.getTime()); // Clone the date object
    startOfDay.setHours(0, 0, 0, 0);
    console.log("Start of Day", startOfDay);
    const endOfDay = new Date(requestedDate.getTime()); // Clone again for end of day
    endOfDay.setHours(23, 59, 59, 999);
    console.log("End of Day", endOfDay);

    // Fetch all existing resource requests for the resource on the selected date
    const existingRequests = await ResourceRequest.find({
      resourceId,
      requestedStartTime: { $gte: startOfDay, $lte: endOfDay }
    });

    console.log(existingRequests)

    // Define the full range of time slots (8 AM - 5 PM)
    const startHour = 8;
    const endHour = 17;
    const fullTimeSlots = generateTimeSlots(startHour, endHour);

    // Filter out time slots that are already allocated
    const allocatedSlots = existingRequests.map((request) => {
      const startTime = new Date(request.requestedStartTime).getHours();
      const endTime = new Date(request.requestedEndTime).getHours();
      return `${startTime}:00 - ${endTime}:00`;
    });



    const availableTimeSlots = fullTimeSlots.filter(
      (slot) => !allocatedSlots.includes(slot)
    );

    return res.json(availableTimeSlots);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch available time slots' });
  }

}


