import express from 'express'
import { deleteUser, getAllUser, getUser, login, signup, updateUser, getUserStats, addToSave, getSaved, removeFromSave } from '../controllers/userController.js';
import  { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middleware/authMiddleware.js'
const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.route('/:id').put(verifyTokenAndAuthorization, updateUser).delete(verifyTokenAndAuthorization, deleteUser);
router.route('/find/:id').get(verifyTokenAndAdmin, getUser)
router.route('/').get(verifyTokenAndAdmin, getAllUser)
router.route('/add/:id').put(verifyTokenAndAuthorization, addToSave)
router.route('/remove/:id').put(verifyTokenAndAuthorization, removeFromSave)
router.route('/saved/:id').get(verifyTokenAndAuthorization, getSaved)
router.route('/stats').get(verifyTokenAndAdmin, getUserStats)

export default router