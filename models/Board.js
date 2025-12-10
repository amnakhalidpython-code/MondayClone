// models/Board.js
import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Board name is required'],
    trim: true,
    maxlength: [40, 'Board name cannot exceed 40 characters']
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

  // User reference (agar authentication hai)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // required: true
  },

  // Board items / rows
  items: [{
    title: String,
    group: String,
    data: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  }],

  // Board settings
  settings: {
    backgroundColor: { type: String, default: '#ffffff' },
    isPublic: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true }
  },

  // Status
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

// ================================
// ✅ Indexes
// ================================
BoardSchema.index({ userId: 1, createdAt: -1 });
BoardSchema.index({ name: 'text' });

// ================================
// ✅ Virtual Field
// ================================
BoardSchema.virtual('columnCount').get(function () {
  return Object.values(this.columns).filter(val => val === true).length;
});

// ================================
// ✅ Instance Method
// ================================
BoardSchema.methods.getActiveColumns = function () {
  const activeColumns = {};
  for (let [key, value] of Object.entries(this.columns)) {
    if (value) activeColumns[key] = value;
  }
  return activeColumns;
};

// ================================
// ✅ Static Method
// ================================
BoardSchema.statics.findByUserId = function (userId) {
  return this.find({
    userId,
    isDeleted: false
  }).sort({ createdAt: -1 });
};

// ================================
// ✅ ES Module Export
// ================================
const Board = mongoose.model('Board', BoardSchema);
export default Board;
