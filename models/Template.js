// models/Template.js
import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
  templateId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  name: { 
    type: String, 
    required: true 
  },
  
  category: { 
    type: String, 
    required: true 
  },
  
  description: String,
  thumbnail: String,
  
  creator: { 
    type: String, 
    default: 'monday.com' 
  },
  
  downloads: String,
  
  integrations: [{
    name: String,
    icon: String
  }],
  
  boardStructure: {
    name: String,
    
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
    
    // ✅ VIEWS - Properly defined with explicit schema
    views: {
      type: [{
        id: { type: String },
        name: { type: String },
        icon: { type: String },
        type: { 
          type: String,
          enum: ['main', 'table', 'kanban', 'calendar', 'dashboard']
        },
        isDefault: { type: Boolean, default: false },
        settings: { type: mongoose.Schema.Types.Mixed }
      }],
      default: []
    },
    
    sampleItems: [{
      title: String,
      group: String,
      data: mongoose.Schema.Types.Mixed,
      createdAt: { type: Date, default: Date.now }
    }],
    
    settings: mongoose.Schema.Types.Mixed
  },
  
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

const Template = mongoose.model('Template', TemplateSchema);
export default Template;