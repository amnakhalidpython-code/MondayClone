/**
 * DynamicColumn Model
 * Stores metadata for custom columns that can be added at runtime
 * Supports various column types like text, number, date, etc.
 */

import mongoose from 'mongoose';

const dynamicColumnSchema = new mongoose.Schema({
  column_key: {
    type: String,
    required: [true, 'Column key is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9_]+$/, 'Column key must contain only lowercase letters, numbers, and underscores']
  },
  title: {
    type: String,
    required: [true, 'Column title is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Column type is required'],
    enum: ['text', 'number', 'email', 'phone', 'date', 'status', 'checkbox', 'dropdown', 'file', 'person', 'link'],
    default: 'text'
  },
  options: {
    type: mongoose.Schema.Types.Mixed, // For dropdown options, status configs, etc.
    default: null
  },
  width: {
    type: Number,
    default: 150
  },
  order: {
    type: Number,
    default: 0
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
dynamicColumnSchema.index({ column_key: 1 });
dynamicColumnSchema.index({ order: 1 });

const DynamicColumn = mongoose.model('DynamicColumn', dynamicColumnSchema);

export default DynamicColumn;
