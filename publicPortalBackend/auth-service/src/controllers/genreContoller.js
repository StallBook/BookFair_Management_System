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
export default { getGenres };