// campaignRoutes.js
import express from 'express';
import {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    markCampaignWinner
} from '../controllers/campaignControllers.js';

const router = express.Router();

// Routes
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);
router.post('/:id/win', markCampaignWinner);

export default router;