/**
 * Advanced Filter Controller
 * Handles complex filtering operations for donors
 */

import Donor from '../models/Donor.js';
import DonorColumnValue from '../models/DonorColumnValue.js';

/**
 * POST /donors/filter
 * Advanced filtering with multiple conditions
 */
export const advancedFilter = async (req, res) => {
  try {
    const { filters, page = 1, limit = 10 } = req.body;

    // Build MongoDB query from filters
    const query = buildFilterQuery(filters);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [donors, total] = await Promise.all([
      Donor.find(query)
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
      message: 'Filtered donors retrieved successfully',
      data: {
        donors: donorsWithCustomFields,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        appliedFilters: filters
      }
    });
  } catch (error) {
    console.error('Error in advancedFilter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to filter donors',
      error: error.message
    });
  }
};

/**
 * Build MongoDB query from filter conditions
 */
function buildFilterQuery(filters) {
  if (!filters || filters.length === 0) {
    return {};
  }

  const conditions = filters.map(filter => {
    const { field, operator, value } = filter;

    switch (operator) {
      case 'equals':
      case 'is':
        return { [field]: value };
      
      case 'not_equals':
      case 'is_not':
        return { [field]: { $ne: value } };
      
      case 'contains':
        return { [field]: { $regex: value, $options: 'i' } };
      
      case 'not_contains':
        return { [field]: { $not: { $regex: value, $options: 'i' } } };
      
      case 'starts_with':
        return { [field]: { $regex: `^${value}`, $options: 'i' } };
      
      case 'ends_with':
        return { [field]: { $regex: `${value}$`, $options: 'i' } };
      
      case 'greater_than':
        return { [field]: { $gt: value } };
      
      case 'greater_than_or_equal':
        return { [field]: { $gte: value } };
      
      case 'less_than':
        return { [field]: { $lt: value } };
      
      case 'less_than_or_equal':
        return { [field]: { $lte: value } };
      
      case 'is_empty':
        return { $or: [{ [field]: null }, { [field]: '' }, { [field]: { $exists: false } }] };
      
      case 'is_not_empty':
        return { [field]: { $exists: true, $ne: null, $ne: '' } };
      
      case 'in':
        return { [field]: { $in: Array.isArray(value) ? value : [value] } };
      
      case 'not_in':
        return { [field]: { $nin: Array.isArray(value) ? value : [value] } };
      
      default:
        return { [field]: value };
    }
  });

  // Combine conditions with AND logic
  return conditions.length > 1 ? { $and: conditions } : conditions[0] || {};
}

/**
 * POST /donors/group-by
 * Group donors by a specific field
 */
export const groupByField = async (req, res) => {
  try {
    const { field } = req.body;

    if (!field) {
      return res.status(400).json({
        success: false,
        message: 'Field is required for grouping'
      });
    }

    // Aggregate donors by field
    const grouped = await Donor.aggregate([
      {
        $group: {
          _id: `$${field}`,
          count: { $sum: 1 },
          donors: { $push: '$$ROOT' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      message: 'Donors grouped successfully',
      data: {
        field,
        groups: grouped.map(g => ({
          value: g._id,
          count: g.count,
          donors: g.donors
        }))
      }
    });
  } catch (error) {
    console.error('Error in groupByField:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to group donors',
      error: error.message
    });
  }
};

/**
 * POST /donors/sort
 * Sort donors by field
 */
export const sortDonors = async (req, res) => {
  try {
    const { field, order = 'asc', page = 1, limit = 10 } = req.body;

    if (!field) {
      return res.status(400).json({
        success: false,
        message: 'Field is required for sorting'
      });
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    const [donors, total] = await Promise.all([
      Donor.find({})
        .sort({ [field]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Donor.countDocuments({})
    ]);

    // Get custom fields
    const donorIds = donors.map(d => d._id);
    const customFields = await DonorColumnValue.find({ 
      donor_id: { $in: donorIds } 
    }).lean();

    const customFieldsByDonor = customFields.reduce((acc, field) => {
      if (!acc[field.donor_id]) acc[field.donor_id] = {};
      acc[field.donor_id][field.column_key] = field.value;
      return acc;
    }, {});

    const donorsWithCustomFields = donors.map(donor => ({
      ...donor,
      customFields: customFieldsByDonor[donor._id] || {}
    }));

    res.json({
      success: true,
      message: 'Donors sorted successfully',
      data: {
        donors: donorsWithCustomFields,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        sort: { field, order }
      }
    });
  } catch (error) {
    console.error('Error in sortDonors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sort donors',
      error: error.message
    });
  }
};

export default {
  advancedFilter,
  groupByField,
  sortDonors
};
