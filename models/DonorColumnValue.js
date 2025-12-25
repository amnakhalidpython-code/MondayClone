/**
 * DonorColumnValue Model
 * Stores the actual values for custom dynamic columns per donor
 * Links donors to their custom field values
 */

import mongoose from 'mongoose';

const donorColumnValueSchema = new mongoose.Schema({
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: [true, 'Donor ID is required'],
    index: true
  },
  column_key: {
    type: String,
    required: [true, 'Column key is required'],
    trim: true,
    lowercase: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Can store any type of value
    default: null
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
donorColumnValueSchema.index({ donor_id: 1, column_key: 1 }, { unique: true });
donorColumnValueSchema.index({ column_key: 1 });

const DonorColumnValue = mongoose.model('DonorColumnValue', donorColumnValueSchema);

export default DonorColumnValue;
