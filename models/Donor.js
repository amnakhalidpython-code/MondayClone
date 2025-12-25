/**
 * Donor Model
 * Stores donor information with core fields
 * Supports dynamic custom fields through DonorColumnValue
 */

import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  donor_name: {
    type: String,
    required: [true, 'Donor name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    default: null
  },
  total_donated: {
    type: Number,
    default: 0,
    min: 0
  },
  total_donations: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['potential', 'active', 'inactive'],
    default: 'potential'
  },
  files: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for custom fields
donorSchema.virtual('customFields', {
  ref: 'DonorColumnValue',
  localField: '_id',
  foreignField: 'donor_id'
});

// Index for faster queries
donorSchema.index({ email: 1 });
donorSchema.index({ donor_name: 1 });
donorSchema.index({ status: 1 });

const Donor = mongoose.model('Donor', donorSchema);

export default Donor;
