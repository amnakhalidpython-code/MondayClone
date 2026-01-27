/**
 * Grant Model
 * Stores grant information with core fields
 * Supports dynamic custom fields through GrantColumnValue
 */

import mongoose from 'mongoose';

const grantSchema = new mongoose.Schema({
    grant_name: {
        type: String,
        required: [true, 'Grant name is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['working', 'submitted', 'awarded', 'potential', 'active', 'inactive'],
        default: 'potential'
    },
    owner: {
        name: String,
        initial: String,
        color: String
    },
    dueDate: {
        type: Date,
        default: null
    },
    grantAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    grantProvider: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    description: {
        type: String,
        default: ''
    },
    requirements: {
        type: String,
        default: ''
    },
    files: [{
        filename: String,
        originalName: String,
        path: String,
        mimetype: String,
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for custom fields
grantSchema.virtual('customFields', {
    ref: 'GrantColumnValue',
    localField: '_id',
    foreignField: 'grant_id'
});

// Index for faster queries
grantSchema.index({ grant_name: 1 });
grantSchema.index({ status: 1 });
grantSchema.index({ dueDate: 1 });

const Grant = mongoose.model('Grant', grantSchema);

export default Grant;