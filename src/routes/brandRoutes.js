import express from 'express';
import {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} from '../controllers/brandController.js';

const router = express.Router();

// Routes for brand operations
router.post('/', createBrand);
router.get('/', getBrands);
router.get('/:id', getBrandById);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

export default router;
