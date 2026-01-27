/**
 * GrantColumnValue Model
 * Stores the actual values for custom dynamic columns per grant
 */

import mongoose from 'mongoose';

const grantColumnValueSchema = new mongoose.Schema({
    grant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grant',
        required: [true, 'Grant ID is required'],
        index: true
    },
    column_key: {
        type: String,
        required: [true, 'Column key is required'],
        trim: true,
        lowercase: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
grantColumnValueSchema.index({ grant_id: 1, column_key: 1 }, { unique: true });
grantColumnValueSchema.index({ column_key: 1 });

const GrantColumnValue = mongoose.model('GrantColumnValue', grantColumnValueSchema);

export default GrantColumnValue;