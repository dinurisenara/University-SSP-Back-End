const Assessment = require("../../models/Assessment");
//Get assesments by academic staff id
exports.getAssesments = async (req,res) =>{
    
    const {academicStaffId} = req.query;
    if(!academicStaffId){
        return res.status(400).json({error:'Academic Staff ID is required'});
    }
    try{
        const assessments = await Assessment.find({assessingStaffMember:academicStaffId});
       console.log(assessments);
        res.json(assessments);
  
    }
    catch(error){
        res.status(500).json({error:'Failed to fetch assesments'});
    }
}

exports.setAssessment = async (req,res) =>{
    const {moduleId, name, type, assessingStaffMember, weightage, Date, TotalMarks} = req.body;
    if(!moduleId || !name ||!type || !assessingStaffMember || !weightage || !Date || !TotalMarks){
        return res.status(400).json({error:'Module ID, type, assessing staff member, weightage, date, and total marks are required'});
    }
    try{
        const newAssessment = new Assessment({moduleId,name, type, assessingStaffMember, weightage, Date, TotalMarks});
        await newAssessment.save();     
        res.json(newAssessment);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:'Failed to add assesment'});
    }
}  