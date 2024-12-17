// campaignController.js
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Campaign from '../models/campaignModel.js';

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
 * @desc Get all campaigns
 * @route GET /api/campaigns
 */
export const getAllCampaigns = asyncHandler(async (req, res) => {
    const campaigns = await Campaign.find().populate('brandId', 'name');
    res.status(200).json(campaigns);
});

/**
 * @desc Get campaign by ID
 * @route GET /api/campaigns/:id
 */
export const getCampaignById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Campaign ID');
    }

    const campaign = await Campaign.findById(id).populate('brandId', 'name');

    if (!campaign) {
        res.status(404);
        throw new Error('Campaign not found');
    }

    res.status(200).json(campaign);
});

/**
 * @desc Create a new campaign
 * @route POST /api/campaigns
 */
export const createCampaign = asyncHandler(async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        const savedCampaign = await campaign.save();
        res.status(201).json(savedCampaign);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ errors: handleValidationError(err) });
        } else {
            throw err;
        }
    }
});

/**
 * @desc Update a campaign
 * @route PUT /api/campaigns/:id
 */
export const updateCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Campaign ID');
    }

    try {
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCampaign) {
            res.status(404);
            throw new Error('Campaign not found');
        }

        res.status(200).json(updatedCampaign);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ errors: handleValidationError(err) });
        } else {
            throw err;
        }
    }
});

/**
 * @desc Delete a campaign
 * @route DELETE /api/campaigns/:id
 */
export const deleteCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Campaign ID');
    }

    const campaign = await Campaign.findByIdAndDelete(id);

    if (!campaign) {
        res.status(404);
        throw new Error('Campaign not found');
    }

    res.status(200).json({ message: 'Campaign deleted successfully' });
});
