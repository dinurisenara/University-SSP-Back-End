const User = require('../../models/User');
const Assessment = require('../../models/Assessment');

exports.getModulesForAssessment = async (req,res)=>{
    const {academicStaffId} = req.query;
    if(!academicStaffId){
        return res.status(400).json({error:'Academic Staff ID is required'});
    }
    try{
    const user= await User.findById(academicStaffId).populate('modules');
    const modules = user.modules;
    console.log(modules);
    res.json(modules);
    }catch(error){
        res.status(500).json({error:'Failed to fetch modules'});
    }
}

exports.getAssessingStaffMembers = async(req,res)=>{
    const {moduleId} = req.query;
    if(!moduleId){
        return res.status(400).json({error:'Module ID is required'});
    }
    try{
    const assessingStaffMembers  = await User.find({modules:{$in:[moduleId]}});
    res.json(assessingStaffMembers);
    }catch(error){
        res.status(500).json({error:'Failed to fetch assessing staff members'});
    }

} 