// models/Board.js
import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Board name is required'],
    trim: true
  },

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
    data: {
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
    enum: ['scratch', 'template'],
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