// backend/models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SignUpAccount', // Apki existing User model ka naam
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'new_lead',
      'lead_assigned',
      'contact_update',
      'deal_won',
      'deal_lost',
      'deal_stage_change',
      'deal_at_risk',
      'task_assigned',
      'task_due_soon',
      'task_overdue',
      'task_completed',
      'mention',
      'comment',
      'board_invite',
      'system',
      'other'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  link: {
    type: String,
    trim: true,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    index: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete after 30 days

// Static methods
notificationSchema.statics.getByUserId = async function(userId, limit = 50, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ userId, isRead: false });
};

notificationSchema.statics.markAsRead = async function(notificationId, userId) {
  const result = await this.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
  return result;
};

notificationSchema.statics.markAllAsRead = async function(userId) {
  const result = await this.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
  return result.modifiedCount;
};

notificationSchema.statics.deleteNotification = async function(notificationId, userId) {
  const result = await this.findOneAndDelete({ _id: notificationId, userId });
  return result;
};

notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

notificationSchema.statics.createBulk = async function(notifications) {
  return this.insertMany(notifications);
};

// Instance method
notificationSchema.methods.isUrgent = function() {
  return this.priority === 'urgent' || this.priority === 'high';
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
