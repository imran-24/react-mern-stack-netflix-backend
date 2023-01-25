import express from 'express'
import { createMovie, updateMovie, deleteMovie, getMovie, getAllMovie, getRandomMovie } from '../controllers/movieControllers.js';
import  {verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middleware/authMiddleware.js'
const router = express.Router();

router.post('/', createMovie);

router.route('/:id').put(verifyTokenAndAdmin, updateMovie).delete(verifyTokenAndAdmin, deleteMovie)
router.route('/find/:id').get(verifyToken, getMovie)
router.route('/').get( getAllMovie)
router.route('/random').get(verifyToken, getRandomMovie)


export default router