/**
 * Column Controller
 * Handles dynamic column management
 * Allows runtime creation and modification of custom columns
 */

import DynamicColumn from '../models/DynamicColumn.js';
import DonorColumnValue from '../models/DonorColumnValue.js';
import { createColumnSchema, updateColumnSchema } from '../validators/donorValidators.js';

/**
 * GET /columns
 * Get all columns
 */
export const getColumns = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    
    const query = includeInactive === 'true' ? {} : { isActive: true };
    
    const columns = await DynamicColumn.find(query)
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.json({
      success: true,
      message: 'Columns retrieved successfully',
      data: columns
    });
  } catch (error) {
    console.error('Error in getColumns:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve columns',
      error: error.message
    });
  }
};

/**
 * GET /columns/:id
 * Get single column by ID
 */
export const getColumnById = async (req, res) => {
  try {
    const { id } = req.params;

    const column = await DynamicColumn.findById(id).lean();
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }

    res.json({
      success: true,
      message: 'Column retrieved successfully',
      data: column
    });
  } catch (error) {
    console.error('Error in getColumnById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve column',
      error: error.message
    });
  }
};

/**
 * POST /columns/add
 * Create new dynamic column
 */
export const createColumn = async (req, res) => {
  try {
    // Validate request body
    const validatedData = createColumnSchema.parse(req.body);

    // Check if column_key already exists
    const existingColumn = await DynamicColumn.findOne({ 
      column_key: validatedData.column_key 
    });
    
    if (existingColumn) {
      return res.status(400).json({
        success: false,
        message: 'Column with this key already exists'
      });
    }

    // Get the highest order number and increment
    const maxOrderColumn = await DynamicColumn.findOne()
      .sort({ order: -1 })
      .select('order')
      .lean();
    
    if (maxOrderColumn && !validatedData.order) {
      validatedData.order = maxOrderColumn.order + 1;
    }

    // Create column
    const column = await DynamicColumn.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Column created successfully',
      data: column
    });
  } catch (error) {
    console.error('Error in createColumn:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create column',
      error: error.message
    });
  }
};

/**
 * PATCH /columns/:id
 * Update column
 */
export const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate request body
    const validatedData = updateColumnSchema.parse(req.body);

    // Check if column exists
    const column = await DynamicColumn.findById(id);
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }

    // Update column
    const updatedColumn = await DynamicColumn.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Column updated successfully',
      data: updatedColumn
    });
  } catch (error) {
    console.error('Error in updateColumn:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update column',
      error: error.message
    });
  }
};

/**
 * DELETE /columns/:id
 * Delete column (soft delete by setting isActive to false)
 */
export const deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    const column = await DynamicColumn.findById(id);
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }

    if (permanent === 'true') {
      // Permanent delete: remove column and all associated values
      await DynamicColumn.findByIdAndDelete(id);
      await DonorColumnValue.deleteMany({ column_key: column.column_key });
      
      res.json({
        success: true,
        message: 'Column permanently deleted',
        data: column
      });
    } else {
      // Soft delete: just mark as inactive
      column.isActive = false;
      await column.save();
      
      res.json({
        success: true,
        message: 'Column deactivated successfully',
        data: column
      });
    }
  } catch (error) {
    console.error('Error in deleteColumn:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete column',
      error: error.message
    });
  }
};

/**
 * PATCH /columns/reorder
 * Reorder columns
 */
export const reorderColumns = async (req, res) => {
  try {
    const { columnOrders } = req.body; // Array of { id, order }

    if (!Array.isArray(columnOrders)) {
      return res.status(400).json({
        success: false,
        message: 'columnOrders must be an array'
      });
    }

    // Update all columns in parallel
    const updatePromises = columnOrders.map(({ id, order }) =>
      DynamicColumn.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedColumns = await DynamicColumn.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    res.json({
      success: true,
      message: 'Columns reordered successfully',
      data: updatedColumns
    });
  } catch (error) {
    console.error('Error in reorderColumns:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder columns',
      error: error.message
    });
  }
};
