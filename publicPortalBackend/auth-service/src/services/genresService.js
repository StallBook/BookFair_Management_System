import user from "../models/user.js";

const addGenre = async (userID, genres) => {
  const updatedUser = await user.findOneAndUpdate(
    { userID: userID },                          
    { $push: { genres: { $each: genres } } },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export default { addGenre };
