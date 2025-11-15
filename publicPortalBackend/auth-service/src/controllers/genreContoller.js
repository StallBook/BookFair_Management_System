import genreService from "../services/genresService.js";

const getGenres = async (req, res) => {
  try {
    const genreTypes = [
      "Fiction",
      "Non-Fiction",
      "Poetry",
      "Children",
      "Comics",
      "Romance",
      "Sci-Fi",
      "Academic",
      "History",
      "Biography",
      "Education",
      "Religious",
      "Other",
    ];
    return res.status(200).json(genreTypes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleAddGenres = async (req, res) => {
  const { userID, genres } = req.body;
  if (!Array.isArray(genres) || genres.length === 0) {
    return res.status(400).json({ error: "Genres is required." });
  }
  try {
    const user = await genreService.addGenre(userID, genres);
    return res.status(200).json({ message: "Genres added successfully", user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleGetUserGenres = async (req, res) => {
  const { userID } = req.body;
  try {
    const genres = await genreService.getUserGenres(userID);
    return res.status(200).json({ genres });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default { getGenres, handleAddGenres, handleGetUserGenres };
