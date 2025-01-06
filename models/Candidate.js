const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    party: {
        type: String,
        required: true
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
});

module.exports = mongoose.model('Candidate', CandidateSchema);
