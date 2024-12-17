import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Analytics from '../models/analyticsModel.js';

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
 * @desc Get all analytics records
 * @route GET /api/analytics
 */
export const getAllAnalytics = asyncHandler(async (req, res) => {
    const analyticsRecords = await Analytics.find()
        .populate('userId', 'name')
        .populate('campaignId', 'name');
    res.status(200).json(analyticsRecords);
});

/**
 * @desc Get an analytics record by ID
 * @route GET /api/analytics/:id
 */
export const getAnalyticsById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Analytics ID');
    }

    const analyticsRecord = await Analytics.findById(id)
        .populate('userId', 'name')
        .populate('campaignId', 'name');

    if (!analyticsRecord) {
        res.status(404);
        throw new Error('Analytics record not found');
    }

    res.status(200).json(analyticsRecord);
});

/**
 * @desc Create a new analytics record
 * @route POST /api/analytics
 */
export const createAnalytics = asyncHandler(async (req, res) => {
    try {
        const analyticsRecord = new Analytics(req.body);
        const savedRecord = await analyticsRecord.save();
        res.status(201).json(savedRecord);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ errors: handleValidationError(err) });
        } else {
            throw err;
        }
    }
});

/**
 * @desc Update an analytics record
 * @route PUT /api/analytics/:id
 */
export const updateAnalytics = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Analytics ID');
    }

    try {
        const updatedRecord = await Analytics.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRecord) {
            res.status(404);
            throw new Error('Analytics record not found');
        }

        res.status(200).json(updatedRecord);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ errors: handleValidationError(err) });
        } else {
            throw err;
        }
    }
});

/**
 * @desc Delete an analytics record
 * @route DELETE /api/analytics/:id
 */
export const deleteAnalytics = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Analytics ID');
    }

    const analyticsRecord = await Analytics.findByIdAndDelete(id);

    if (!analyticsRecord) {
        res.status(404);
        throw new Error('Analytics record not found');
    }

    res.status(200).json({ message: 'Analytics record deleted successfully' });
});
