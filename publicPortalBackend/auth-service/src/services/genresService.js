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

const deleteGenre = async (userID, genreID) => {
    const updatedUser = await user.findOneAndUpdate(
        { userID },
        { $pull: { genres: { _id: genreID } } },
        { new: true }
    );

    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
};

const updateGenre =async (userID, genreID, genreData) => {
    const foundUser = await user.findOne({ userID });
    if (!foundUser) {
        throw new Error("User not found");
    }
     const genreExists = foundUser.genres.some(g => g._id.toString() === genreID);
    if (!genreExists) {
        throw new Error("Genre not found");
    }
    const updatedUser = await user.findOneAndUpdate(
        { userID, "genres._id": genreID },
        { $set: { "genres.$": genreData } },
        { new: true }
    );
    return updatedUser;
};



export default { addGenre, getUserGenres,deleteGenre,updateGenre };