// models/Template.js
import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
  templateId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  category: {
    type: String,
    required: true,
    enum: ['Marketing', 'HR', 'Nonprofits', 'Sales & CRM', 'Project Management', 'Software Development'],
    default: 'Nonprofits'
  },
  
  description: {
    type: String,
    required: true
  },
  
  thumbnail: {
    type: String,
    default: ''
  },
  
  creator: {
    type: String,
    default: 'monday.com'
  },
  
  downloads: {
    type: String,
    default: '0'
  },
  
  // Integrations display ke liye
  integrations: [{
    name: String,
    icon: String
  }],
  
  // Board structure jo create hogi
  boardStructure: {
    name: { type: String, required: true },
    
    // Columns configuration (same as Board model)
    columns: {
      owner: { type: Boolean, default: true },
      status: { type: Boolean, default: true },
      dueDate: { type: Boolean, default: true },
      priority: { type: Boolean, default: false },
      lastUpdated: { type: Boolean, default: false },
      timeline: { type: Boolean, default: false },
      notes: { type: Boolean, default: false },
      budget: { type: Boolean, default: false },
      files: { type: Boolean, default: false }
    },
    
    // Pre-filled items (optional)
    sampleItems: [{
      title: String,
      group: String,
      data: mongoose.Schema.Types.Mixed
    }],
    
    // Board settings
    settings: {
      backgroundColor: { type: String, default: '#ffffff' },
      isPublic: { type: Boolean, default: false },
      allowComments: { type: Boolean, default: true }
    }
  },
  
  // Analytics
  usageCount: {
    type: Number,
    default: 0
  },
  
  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

// Index for fast searching
TemplateSchema.index({ category: 1, isActive: 1 });
TemplateSchema.index({ templateId: 1 });

const Template = mongoose.model('Template', TemplateSchema);
export default Template;