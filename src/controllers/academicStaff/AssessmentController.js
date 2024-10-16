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
    const {moduleId, name, type, assessingStaffMember, weightage, Date, totalMarks} = req.body;
    if(!moduleId || !name ||!type || !assessingStaffMember || !weightage || !Date || !totalMarks){
        return res.status(400).json({error:'Module ID, type, assessing staff member, weightage, date, and total marks are required'});
    }
    try{
        const newAssessment = new Assessment({moduleId,name, type, assessingStaffMember, weightage, Date, totalMarks});
        await newAssessment.save();     
        res.status(200).json({newAssessment, msg:'Assessment added successfully'});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:'Failed to add assesment'});
    }
}  

