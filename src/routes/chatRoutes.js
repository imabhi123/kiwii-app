// routes/chatRoutes.js
import express from 'express';
import { chatController } from '../controllers/chatController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js'

const router = express.Router();

// router.use(verifyJWT);

router.post('/create', chatController.createChat);
router.get('/history', chatController.getChatHistory);
router.get('/:chatId', chatController.getChatById);
router.patch('/:chatId/resolve', chatController.resolveChat);

export default router;