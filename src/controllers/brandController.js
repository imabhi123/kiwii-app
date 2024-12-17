import  Brand  from '../models/brandModel.js';

// Create a new brand
export const createBrand = async (req, res) => {
    try {
        const { name, email, password, logoUrl } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All required fields must be provided.' });
        }

        const existingBrand = await Brand.findOne({ email });
        if (existingBrand) {
            return res.status(400).json({ error: 'Brand with this email already exists.' });
        }

        const newBrand = new Brand({ name, email, password, logoUrl });
        await newBrand.save();

        return res.status(201).json({ message: 'Brand created successfully.', brand: newBrand });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create brand.', details: error.message });
    }
};

// Get all brands
export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        return res.status(200).json({ message: 'Brands retrieved successfully.', brands });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch brands.', details: error.message });
    }
};

// Get a single brand by ID
export const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Brand ID is required.' });
        }

        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found.' });
        }

        return res.status(200).json({ message: 'Brand retrieved successfully.', brand });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch brand.', details: error.message });
    }
};

// Update a brand
export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, logoUrl } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Brand ID is required.' });
        }

        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            { name, email, password, logoUrl, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedBrand) {
            return res.status(404).json({ error: 'Brand not found.' });
        }

        return res.status(200).json({ message: 'Brand updated successfully.', brand: updatedBrand });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update brand.', details: error.message });
    }
};

// Delete a brand
export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Brand ID is required.' });
        }

        const deletedBrand = await Brand.findByIdAndDelete(id);
        if (!deletedBrand) {
            return res.status(404).json({ error: 'Brand not found.' });
        }

        return res.status(200).json({ message: 'Brand deleted successfully.', brand: deletedBrand });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete brand.', details: error.message });
    }
};
