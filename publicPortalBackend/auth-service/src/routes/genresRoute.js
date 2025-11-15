import express from 'express';
import genreContoller from '../controllers/genreContoller.js';
const router = express.Router();

router.get("/types",genreContoller.getGenres)
router.post("/add",genreContoller.handleAddGenres);
router.get("/userGenres",genreContoller.handleGetUserGenres);
router.delete("/delete",genreContoller.handleDeleteGenre);
router.put("/update",genreContoller.handleUpadteGenres);
export default router;