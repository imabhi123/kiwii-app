// prizeController.js
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Prize from '../models/prizeModel.js';

/**
 * Utility function to handle Mongoose validation errors
 */
const handleValidationError = (err) => {
    const errors = {};
    for (const field in err.errors) {
        errors[field] = err.errors[field].message;
    }
    return errors;
};

/**
 * @desc Get all prizes
 * @route GET /api/prizes
 */
export const getAllPrizes = asyncHandler(async (req, res) => {
    const prizes = await Prize.find().populate('campaignId', 'name');
    res.status(200).json(prizes);
});

/**
 * @desc Get prize by ID
 * @route GET /api/prizes/:id
 */
export const getPrizeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Prize ID');
    }

    const prize = await Prize.findById(id).populate('campaignId', 'name');

    if (!prize) {
        res.status(404);
        throw new Error('Prize not found');
    }

    res.status(200).json(prize);
});

/**
 * @desc Create a new prize
 * @route POST /api/prizes
 */
export const createPrize = asyncHandler(async (req, res) => {
    try {
        const prize = new Prize(req.body);
        const savedPrize = await prize.save();
        res.status(201).json(savedPrize);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ errors: handleValidationError(err) });
        } else {
            throw err;
        }
    }
});

/**
 * @desc Update a prize
 * @route PUT /api/prizes/:id
 */
export const updatePrize = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Prize ID');
    }

    try {
        const updatedPrize = await Prize.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPrize) {
            res.status(404);
            throw new Error('Prize not found');
        }

        res.status(200).json(updatedPrize);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ errors: handleValidationError(err) });
        } else {
            throw err;
        }
    }
});

/**
 * @desc Delete a prize
 * @route DELETE /api/prizes/:id
 */
export const deletePrize = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Prize ID');
    }

    const prize = await Prize.findByIdAndDelete(id);

    if (!prize) {
        res.status(404);
        throw new Error('Prize not found');
    }

    res.status(200).json({ message: 'Prize deleted successfully' });
});
