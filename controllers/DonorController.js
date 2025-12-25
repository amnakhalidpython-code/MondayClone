/**
 * Donor Controller
 * Handles all donor-related business logic
 * Supports CRUD operations, file uploads, and custom fields
 */

import Donor from '../models/Donor.js';
import DonorColumnValue from '../models/DonorColumnValue.js';
import DynamicColumn from '../models/DynamicColumn.js';
import { 
  createDonorSchema, 
  updateDonorSchema, 
  updateCustomFieldSchema,
  querySchema 
} from '../validators/donorValidators.js';

/**
 * GET /donors
 * Get all donors with pagination, search, and sorting
 */
export const getDonors = async (req, res) => {
  try {
    // Validate and parse query parameters
    const { page, limit, search, sortBy, order, status } = querySchema.parse(req.query);
    
    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { donor_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    // Execute query
    const [donors, total] = await Promise.all([
      Donor.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Donor.countDocuments(query)
    ]);

    // Get custom fields for each donor
    const donorIds = donors.map(d => d._id);
    const customFields = await DonorColumnValue.find({ 
      donor_id: { $in: donorIds } 
    }).lean();

    // Group custom fields by donor
    const customFieldsByDonor = customFields.reduce((acc, field) => {
      if (!acc[field.donor_id]) acc[field.donor_id] = {};
      acc[field.donor_id][field.column_key] = field.value;
      return acc;
    }, {});

    // Merge custom fields with donors
    const donorsWithCustomFields = donors.map(donor => ({
      ...donor,
      customFields: customFieldsByDonor[donor._id] || {}
    }));

    res.json({
      success: true,
      message: 'Donors retrieved successfully',
      data: {
        donors: donorsWithCustomFields,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error in getDonors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve donors',
      error: error.message
    });
  }
};

/**
 * GET /donors/:id
 * Get single donor by ID
 */
export const getDonorById = async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await Donor.findById(id).lean();
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // Get custom fields
    const customFields = await DonorColumnValue.find({ donor_id: id }).lean();
    const customFieldsObj = customFields.reduce((acc, field) => {
      acc[field.column_key] = field.value;
      return acc;
    }, {});

    res.json({
      success: true,
      message: 'Donor retrieved successfully',
      data: {
        ...donor,
        customFields: customFieldsObj
      }
    });
  } catch (error) {
    console.error('Error in getDonorById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve donor',
      error: error.message
    });
  }
};

/**
 * POST /donors
 * Create new donor
 */
export const createDonor = async (req, res) => {
  try {
    // Validate request body
    const validatedData = createDonorSchema.parse(req.body);

    // Check if email already exists
    const existingDonor = await Donor.findOne({ email: validatedData.email });
    if (existingDonor) {
      return res.status(400).json({
        success: false,
        message: 'Donor with this email already exists'
      });
    }

    // Create donor
    const donor = await Donor.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Donor created successfully',
      data: donor
    });
  } catch (error) {
    console.error('Error in createDonor:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create donor',
      error: error.message
    });
  }
};

/**
 * PATCH /donors/:id
 * Update donor
 */
export const updateDonor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate request body
    const validatedData = updateDonorSchema.parse(req.body);

    // Check if donor exists
    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // If email is being updated, check for duplicates
    if (validatedData.email && validatedData.email !== donor.email) {
      const existingDonor = await Donor.findOne({ email: validatedData.email });
      if (existingDonor) {
        return res.status(400).json({
          success: false,
          message: 'Donor with this email already exists'
        });
      }
    }

    // Update donor
    const updatedDonor = await Donor.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Donor updated successfully',
      data: updatedDonor
    });
  } catch (error) {
    console.error('Error in updateDonor:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update donor',
      error: error.message
    });
  }
};

/**
 * DELETE /donors/:id
 * Delete donor
 */
export const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await Donor.findByIdAndDelete(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // Delete associated custom field values
    await DonorColumnValue.deleteMany({ donor_id: id });

    res.json({
      success: true,
      message: 'Donor deleted successfully',
      data: donor
    });
  } catch (error) {
    console.error('Error in deleteDonor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete donor',
      error: error.message
    });
  }
};

/**
 * PATCH /donors/:id/custom
 * Update custom field value for a donor
 */
export const updateCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const { column_key, value } = updateCustomFieldSchema.parse(req.body);

    // Check if donor exists
    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // Check if column exists
    const column = await DynamicColumn.findOne({ column_key, isActive: true });
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Column not found or inactive'
      });
    }

    // Update or create custom field value
    const customField = await DonorColumnValue.findOneAndUpdate(
      { donor_id: id, column_key },
      { value },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Custom field updated successfully',
      data: customField
    });
  } catch (error) {
    console.error('Error in updateCustomField:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update custom field',
      error: error.message
    });
  }
};

/**
 * POST /donors/:id/files
 * Upload file for donor
 */
export const uploadDonorFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // Add file metadata to donor
    const fileMetadata = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date()
    };

    donor.files.push(fileMetadata);
    await donor.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: fileMetadata
    });
  } catch (error) {
    console.error('Error in uploadDonorFile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

/**
 * GET /donors/:id/files
 * Get all files for a donor
 */
export const getDonorFiles = async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await Donor.findById(id).select('files').lean();
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.json({
      success: true,
      message: 'Files retrieved successfully',
      data: donor.files || []
    });
  } catch (error) {
    console.error('Error in getDonorFiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve files',
      error: error.message
    });
  }
};
