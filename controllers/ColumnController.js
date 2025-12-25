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

    const column = await DynamicColumn.findOne({ column_key: id }).lean();
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
    const column = await DynamicColumn.findOne({ column_key: id });
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }

    // Update column
    const updatedColumn = await DynamicColumn.findOneAndUpdate(
      { column_key: id },
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

    const column = await DynamicColumn.findOne({ column_key: id });
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }

    if (permanent === 'true') {
      // Permanent delete: remove column and all associated values
      await DynamicColumn.findOneAndDelete({ column_key: id });
      await DonorColumnValue.deleteMany({ column_key: id });
      
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

/**
 * POST /columns/:id/duplicate
 * Duplicate a column
 */
export const duplicateColumn = async (req, res) => {
  try {
    const { id } = req.params;

    const column = await DynamicColumn.findOne({ column_key: id });
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }

    // Create duplicate with new key
    const duplicateData = {
      column_key: `${column.column_key}_copy_${Date.now()}`,
      title: `${column.title} (Copy)`,
      type: column.type,
      options: column.options,
      width: column.width,
      order: column.order + 1,
      isRequired: column.isRequired
    };

    const duplicatedColumn = await DynamicColumn.create(duplicateData);

    // Copy all values from original column to duplicated column
    const originalValues = await DonorColumnValue.find({
      column_key: column.column_key
    }).lean();

    if (originalValues.length > 0) {
      const duplicatedValues = originalValues.map(val => ({
        donor_id: val.donor_id,
        column_key: duplicatedColumn.column_key,
        value: val.value
      }));
      await DonorColumnValue.insertMany(duplicatedValues);
    }

    res.status(201).json({
      success: true,
      message: 'Column duplicated successfully',
      data: duplicatedColumn
    });
  } catch (error) {
    console.error('Error in duplicateColumn:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate column',
      error: error.message
    });
  }
};

/**
 * PATCH /columns/:id/change-type
 * Change column type
 */
export const changeColumnType = async (req, res) => {
  try {
    const { id } = req.params;
    const { newType, options } = req.body;

    if (!newType) {
      return res.status(400).json({
        success: false,
        message: 'newType is required'
      });
    }

    const column = await DynamicColumn.findOne({ column_key: id });
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }

    // Update column type
    column.type = newType;
    if (options) {
      column.options = options;
    }
    await column.save();

    res.json({
      success: true,
      message: 'Column type changed successfully',
      data: column
    });
  } catch (error) {
    console.error('Error in changeColumnType:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change column type',
      error: error.message
    });
  }
};

/**
 * POST /columns/:id/autofill
 * Autofill column with a value
 */
export const autofillColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, donorIds } = req.body;

    const column = await DynamicColumn.findOne({ column_key: id });
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }

    // If donorIds provided, autofill only those donors, otherwise all
    const query = donorIds && donorIds.length > 0
      ? { _id: { $in: donorIds } }
      : {};

    const donors = await import('../models/Donor.js').then(m => m.default.find(query).select('_id'));

    const autofillPromises = donors.map(donor =>
      DonorColumnValue.findOneAndUpdate(
        { donor_id: donor._id, column_key: column.column_key },
        { value },
        { upsert: true, new: true }
      )
    );

    await Promise.all(autofillPromises);

    res.json({
      success: true,
      message: `Autofilled ${donors.length} donors`,
      data: { count: donors.length, value }
    });
  } catch (error) {
    console.error('Error in autofillColumn:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to autofill column',
      error: error.message
    });
  }
};

/**
 * POST /columns/:id/add-to-right
 * Add a new column to the right of current column
 */
export const addColumnToRight = async (req, res) => {
  try {
    const { id } = req.params;
    const { column_key, title, type } = req.body;

    const currentColumn = await DynamicColumn.findOne({ column_key: id });
    if (!currentColumn) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }

    // Shift all columns to the right
    await DynamicColumn.updateMany(
      { order: { $gt: currentColumn.order } },
      { $inc: { order: 1 } }
    );

    // Create new column
    const newColumn = await DynamicColumn.create({
      column_key: column_key || `col_${Date.now()}`,
      title: title || 'New Column',
      type: type || 'text',
      order: currentColumn.order + 1,
      width: 150
    });

    res.status(201).json({
      success: true,
      message: 'Column added successfully',
      data: newColumn
    });
  } catch (error) {
    console.error('Error in addColumnToRight:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add column',
      error: error.message
    });
  }
};
