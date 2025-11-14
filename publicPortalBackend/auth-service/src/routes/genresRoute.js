import express from 'express';
import genreContoller from '../controllers/genreContoller.js';
const router = express.Router();

router.get("/types",genreContoller.getGenres)

export default router;