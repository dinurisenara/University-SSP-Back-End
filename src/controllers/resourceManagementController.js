const UniResource = require("../models/UniResource");
const UniResourceRequest = require("../models/UniResourceRequest");





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
const generateTimeSlots = (startHour, endHour) => {
  const timeSlots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0-23 hour format to 1-12
    const slot = `${formattedHour}:00 ${ampm} - ${formattedHour + 1}:00 ${ampm}`;
    timeSlots.push(slot);
  }
  return timeSlots;
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
    const existingRequests = await UniResourceRequest.find({
      resourceId,
      status:'approved',
      requestedStartTime: { $gte: startOfDay, $lte: endOfDay }
    });
    // Define the full range of time slots (8 AM - 5 PM)
    const startHour = 8;
    const endHour = 17;
    const fullTimeSlots = generateTimeSlots(startHour, endHour);

    // Filter out time slots that are already allocated

    const allocatedSlots = [];
    // const allocatedSlots = existingRequests.map((request) => {
    //   const startTime = new Date(request.requestedStartTime).getHours();
    //   const endTime = new Date(request.requestedEndTime).getHours();
    //   return `${startTime}:00 - ${endTime}:00`;
    // });
    
    existingRequests.forEach((request) => {
      const startTime = new Date(request.requestedStartTime);
      const endTime = new Date(request.requestedEndTime);

      // Generate time slots for the existing request
      let currentStartHour = startTime.getHours();
      const currentEndHour = endTime.getHours();
      const ampmStart = currentStartHour >= 12 ? 'PM' : 'AM';
      const ampmEnd = currentEndHour >= 12 ? 'PM' : 'AM';

      // Add all slots from start to end hour
      while (currentStartHour < currentEndHour) {
        const formattedHour = currentStartHour % 12 || 12; // Convert 0-23 hour format to 1-12
        const slot = `${formattedHour}:00 ${ampmStart} - ${formattedHour + 1}:00 ${ampmStart}`;
        allocatedSlots.push(slot);
        currentStartHour++;
      }
    });

    const availableTimeSlots = fullTimeSlots.filter(
      (slot) => !allocatedSlots.includes(slot)
    );
    
    console.log("existing requests",existingRequests)
    console.log("allocated slots",allocatedSlots);
    console.log("available tie slots",availableTimeSlots);  
    return res.json(availableTimeSlots);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch available time slots' });
  }

}


