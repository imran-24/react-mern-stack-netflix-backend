import express from 'express'
import { createMemory, deleteMemory, getAllMemory, getMemory, likeMemory, updateMemory } from '../controllers/memoryControllers.js';

import  { verifyToken, verifyTokenAndCRUD } from '../middleware/authMiddleware.js'
const router = express.Router();

router.post('/',verifyToken, createMemory);

router.route('/:id').put(verifyTokenAndCRUD, updateMemory).delete(verifyTokenAndCRUD, deleteMemory)
router.route('/:id').get(getMemory)
router.route('/like/:id').put( likeMemory)
router.route('/').get(getAllMemory)


export default router