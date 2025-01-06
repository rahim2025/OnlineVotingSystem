const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    candidates: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        manifesto: {
            type: String,
            required: true
        },
        votes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        voteCount: {
            type: Number,
            default: 0
        }
    }],
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Election', ElectionSchema);
