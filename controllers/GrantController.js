/**
 * Grant Controller
 * Handles all grant-related business logic
 */

import Grant from '../models/Grant.js';
import GrantColumnValue from '../models/GrantColumnValue.js';
import DynamicColumn from '../models/DynamicColumn.js';
import { z } from 'zod';

// Validation schemas
const createGrantSchema = z.object({
    grant_name: z.string().min(1, 'Grant name is required'),
    status: z.enum(['working', 'submitted', 'awarded', 'potential', 'active', 'inactive']).optional(),
    owner: z.object({
        name: z.string().optional(),
        initial: z.string().optional(),
        color: z.string().optional()
    }).optional(),
    dueDate: z.string().optional().transform(str => str ? new Date(str) : null),
    grantAmount: z.number().min(0).optional(),
    grantProvider: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    description: z.string().optional(),
    requirements: z.string().optional()
});

const updateGrantSchema = z.object({
    grant_name: z.string().min(1).optional(),
    status: z.enum(['working', 'submitted', 'awarded', 'potential', 'active', 'inactive']).optional(),
    owner: z.object({
        name: z.string().optional(),
        initial: z.string().optional(),
        color: z.string().optional()
    }).optional().nullable(),
    dueDate: z.string().optional().transform(str => str ? new Date(str) : null),
    grantAmount: z.number().min(0).optional(),
    grantProvider: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    description: z.string().optional(),
    requirements: z.string().optional()
});

const querySchema = z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('50'),
    search: z.string().optional(),
    status: z.string().optional()
});

/**
 * GET /grants
 * Get all grants with pagination, search, and sorting
 */
export const getGrants = async (req, res) => {
    try {
        const { page, limit, search, status } = querySchema.parse(req.query);

        // Build query
        const query = {};
        if (search) {
            query.$or = [
                { grant_name: { $regex: search, $options: 'i' } },
                { grantProvider: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) {
            query.status = status;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const [grants, total] = await Promise.all([
            Grant.find(query)
                .sort({ dueDate: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Grant.countDocuments(query)
        ]);

        // Get custom fields for each grant
        const grantIds = grants.map(g => g._id);
        const customFields = await GrantColumnValue.find({
            grant_id: { $in: grantIds }
        }).lean();

        // Group custom fields by grant
        const customFieldsByGrant = customFields.reduce((acc, field) => {
            if (!acc[field.grant_id]) acc[field.grant_id] = {};
            acc[field.grant_id][field.column_key] = field.value;
            return acc;
        }, {});

        // Merge custom fields with grants
        const grantsWithCustomFields = grants.map(grant => ({
            ...grant,
            id: grant._id,
            customFields: customFieldsByGrant[grant._id] || {}
        }));

        res.json({
            success: true,
            message: 'Grants retrieved successfully',
            data: {
                grants: grantsWithCustomFields,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error in getGrants:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve grants',
            error: error.message
        });
    }
};

/**
 * GET /grants/:id
 * Get single grant by ID
 */
export const getGrantById = async (req, res) => {
    try {
        const { id } = req.params;

        const grant = await Grant.findById(id).lean();
        if (!grant) {
            return res.status(404).json({
                success: false,
                message: 'Grant not found'
            });
        }

        // Get custom fields
        const customFields = await GrantColumnValue.find({ grant_id: id }).lean();
        const customFieldsObj = customFields.reduce((acc, field) => {
            acc[field.column_key] = field.value;
            return acc;
        }, {});

        res.json({
            success: true,
            message: 'Grant retrieved successfully',
            data: {
                ...grant,
                id: grant._id,
                customFields: customFieldsObj
            }
        });
    } catch (error) {
        console.error('Error in getGrantById:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve grant',
            error: error.message
        });
    }
};

/**
 * POST /grants
 * Create new grant
 */
export const createGrant = async (req, res) => {
    try {
        const validatedData = createGrantSchema.parse(req.body);

        // Create grant
        const grant = await Grant.create(validatedData);

        res.status(201).json({
            success: true,
            message: 'Grant created successfully',
            data: {
                ...grant.toObject(),
                id: grant._id
            }
        });
    } catch (error) {
        console.error('Error in createGrant:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to create grant',
            error: error.message
        });
    }
};

/**
 * PATCH /grants/:id
 * Update grant
 */
export const updateGrant = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = updateGrantSchema.parse(req.body);

        const grant = await Grant.findById(id);
        if (!grant) {
            return res.status(404).json({
                success: false,
                message: 'Grant not found'
            });
        }

        // Update grant
        const updatedGrant = await Grant.findByIdAndUpdate(
            id,
            { $set: validatedData },
            { new: true, runValidators: true }
        ).lean();

        res.json({
            success: true,
            message: 'Grant updated successfully',
            data: {
                ...updatedGrant,
                id: updatedGrant._id
            }
        });
    } catch (error) {
        console.error('Error in updateGrant:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to update grant',
            error: error.message
        });
    }
};

/**
 * DELETE /grants/:id
 * Delete grant
 */
export const deleteGrant = async (req, res) => {
    try {
        const { id } = req.params;

        const grant = await Grant.findByIdAndDelete(id);
        if (!grant) {
            return res.status(404).json({
                success: false,
                message: 'Grant not found'
            });
        }

        // Delete associated custom field values
        await GrantColumnValue.deleteMany({ grant_id: id });

        res.json({
            success: true,
            message: 'Grant deleted successfully',
            data: grant
        });
    } catch (error) {
        console.error('Error in deleteGrant:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete grant',
            error: error.message
        });
    }
};

/**
 * GET /grants/stats/summary
 * Get grant statistics summary
 */
export const getGrantStats = async (req, res) => {
    try {
        const stats = await Grant.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$grantAmount' }
                }
            }
        ]);

        const totalGrants = await Grant.countDocuments();
        const totalAmount = await Grant.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$grantAmount' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                byStatus: stats,
                totalGrants,
                totalAmount: totalAmount[0]?.total || 0
            }
        });
    } catch (error) {
        console.error('Error in getGrantStats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get grant stats',
            error: error.message
        });
    }
};

/**
 * POST /grants/:id/files
 * Upload file for grant
 */
export const uploadGrantFile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const grant = await Grant.findById(id);
        if (!grant) {
            return res.status(404).json({
                success: false,
                message: 'Grant not found'
            });
        }

        // Add file metadata to grant
        const fileMetadata = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadedAt: new Date()
        };

        grant.files.push(fileMetadata);
        await grant.save();

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            data: fileMetadata
        });
    } catch (error) {
        console.error('Error in uploadGrantFile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload file',
            error: error.message
        });
    }
};