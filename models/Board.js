// models/Board.js
import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Board name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['board', 'dashboard'],
    default: 'board'
  },

  columns: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      owner: true,
      status: true,
      dueDate: true,
      priority: false,
      lastUpdated: false,
      timeline: false,
      notes: false,
      budget: false,
      files: false,
      email: false,
      phone: false,
      numbers: false,
      checkbox: false,
      dropdown: false,
      formula: false
    }
  },
  // ✅ NEW: Store custom column titles
  columnTitles: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // ✅ NEW: Store column order
  columnOrder: {
    type: [String],
    default: []
  },
  // Store Widget selections for Dashboards
  widgetSettings: {
    tasksOverview: { type: Boolean, default: true },
    tasksByStatus: { type: Boolean, default: true },
    tasksByOwner: { type: Boolean, default: true },
    overdueTasks: { type: Boolean, default: false },
    tasksByDueDate: { type: Boolean, default: false }
  },

  // ✅ CRITICAL FIX: userId is String (Firebase UID)
  userId: {
    type: String,
    required: false
  },

  userEmail: {
    type: String,
    trim: true
  },

  items: [{
    title: {
      type: String,
      required: true
    },
    group: {
      type: String,
      default: 'default'
    },
    column_values: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  views: [{
    id: String,
    name: String,
    icon: String,
    type: {
      type: String,
      enum: ['main', 'table', 'kanban', 'calendar', 'dashboard'],
      default: 'main'
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    settings: mongoose.Schema.Types.Mixed
  }],

  settings: {
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    allowComments: {
      type: Boolean,
      default: true
    }
  },

  createdFrom: {
    type: String,
    enum: ['scratch', 'template','onboarding'],
    default: 'scratch'
  },

  templateId: String,

  isActive: {
    type: Boolean,
    default: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// Indexes
BoardSchema.index({ name: 'text' });
BoardSchema.index({ userEmail: 1 });
BoardSchema.index({ userId: 1 });

const Board = mongoose.model('Board', BoardSchema);
export default Board;