import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 40 },
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    title: String,
    group: String,
    data: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  }],
  settings: {
    backgroundColor: { type: String, default: '#ffffff' },
    isPublic: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true }
  },
  createdFrom: { type: String, enum: ['scratch', 'template'], default: 'scratch' },
  templateId: { type: String, ref: 'Template' },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// 🔹 Text index for search
BoardSchema.index({ name: 'text' });

const Board = mongoose.model('Board', BoardSchema);

export default Board;
