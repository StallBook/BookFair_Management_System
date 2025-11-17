import businessService from "../services/businessService.js";

const handleAddBusinessDetails = async (req, res) => {
  const { userID, business } = req.body;
  if (!Array.isArray(business) || business.length === 0) {
    return res.status(400).json({ error: "Details are required." });
  }
  try {
    const user = await businessService.addBusinessDetails(userID, business);
    return res.status(200).json({ message: "success", user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleViewBusinessDetails = async(req,res)=>{
   const { userID } = req.body;
   try {
     const businessDetails = await businessService.viewBusinessDetails(userID);
     return res.status(200).json({ message: "success", businessDetails });
   } catch (error) {
     return res.status(500).json({ error: error.message });
   }

}

export default { handleAddBusinessDetails, handleViewBusinessDetails };
