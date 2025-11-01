const Stall = require("../models/Stall")

const getAllStalls = async (request,response) => {
    try{
        const stalls = await Stall.find().sort({name:1});
        if(!stalls.length){
            return response.status(404).json({message:"No stalls found"})
        }
        response.status(200).json({message:"Stalls fetched successfully",data:stalls})
    } catch(error){
        response.status(500).json({message:"Internal server error"})
    }
    
}

module.exports ={
    getAllStalls
}