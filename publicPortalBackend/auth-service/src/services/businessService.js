import user from "../models/user.js";

const addBusinessDetails = async (userID, business) => {
  const updatedUser = await user.findOneAndUpdate(
    { userID: userID },
    { $set: { business: business } },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export default { addBusinessDetails };
