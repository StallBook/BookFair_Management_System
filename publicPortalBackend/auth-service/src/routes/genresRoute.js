import express from 'express';
import genreContoller from '../controllers/genreContoller.js';
const router = express.Router();

router.get("/types",genreContoller.getGenres)
router.post("/add",genreContoller.handleAddGenres);
router.post("/userGenres",genreContoller.handleGetUserGenres);
router.delete("/delete",genreContoller.handleDeleteGenre);
router.put("/update",genreContoller.handleUpdateGenres);
export default router;