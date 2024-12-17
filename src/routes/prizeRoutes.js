// prizeRoutes.js
import express from 'express';
import {
    getAllPrizes,
    getPrizeById,
    createPrize,
    updatePrize,
    deletePrize
} from '../controllers/prizeControllers.js';

const router = express.Router();

// Routes
router.get('/', getAllPrizes);
router.get('/:id', getPrizeById);
router.post('/', createPrize);
router.put('/:id', updatePrize);
router.delete('/:id', deletePrize);

export default router;