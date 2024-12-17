import express from 'express';
import {
    getAllAnalytics,
    getAnalyticsById,
    createAnalytics,
    updateAnalytics,
    deleteAnalytics,
} from '../controllers/analyticsControllers.js';

const router = express.Router();

// Get all analytics records
router.get('/', getAllAnalytics);

// Get a single analytics record by ID
router.get('/:id', getAnalyticsById);

// Create a new analytics record
router.post('/', createAnalytics);

// Update an analytics record
router.put('/:id', updateAnalytics);

// Delete an analytics record
router.delete('/:id', deleteAnalytics);

export default router;
