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

const viewBusinessDetails = async (userID) => {
  const foundUser = await user.findOne({ userID: userID });
  if (!foundUser) {
    throw new Error("User not found");
  } 
  if (!foundUser.business) {
    return { message: "User has no business details" };
  }

  return foundUser.business;
};

export default { addBusinessDetails, viewBusinessDetails };
