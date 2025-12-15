// models/Board.js
import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  items: [{
    title: String,
    group: String,
    data: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  }],

  // ✅ NEW: Board Views/Sections
  views: [{
    id: String,
    name: String,
    icon: String,
    type: {
      type: String,
      enum: ['main', 'table', 'kanban', 'calendar', 'dashboard'],
      default: 'main'
    },
    isDefault: { type: Boolean, default: false },
    settings: mongoose.Schema.Types.Mixed
  }],

  settings: {
    backgroundColor: { type: String, default: '#ffffff' },
    isPublic: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true }
  },

  createdFrom: {
    type: String,
    enum: ['scratch', 'template'],
    default: 'scratch'
  },

  templateId: String,

  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }

}, {
  timestamps: true
});

const Board = mongoose.model('Board', BoardSchema);
export default Board;