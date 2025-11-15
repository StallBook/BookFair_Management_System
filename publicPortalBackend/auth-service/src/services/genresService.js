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

const getUserGenres = async (userID) => {
  const foundUser = await user.findOne({ userID: userID });
  if (!foundUser) {
    throw new Error("User not found");
  }
  if (!foundUser.genres || foundUser.genres.length === 0) {
    return { message: "User has no genres" };
  }
  return foundUser.genres;
};

export default { addGenre, getUserGenres };