import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  inviterUserId: {
    type: String,
    required: true
  },
  inviterName: {
    type: String,
    required: true
  },
  inviterEmail: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  invitedEmail: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Member', 'Viewer'],
    default: 'Member'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  invitationToken: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;