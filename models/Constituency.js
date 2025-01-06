const mongoose = require('mongoose');

const ConstituencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    division: {
        type: String,
        required: true,
        enum: ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh']
    },
    district: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    demographics: {
        totalPopulation: Number,
        voterCount: Number,
        literacyRate: Number,
        malePopulation: Number,
        femalePopulation: Number,
        avgIncome: Number
    },
    currentRepresentative: {
        name: String,
        party: String,
        startTerm: Date,
        endTerm: Date,
        contactInfo: {
            email: String,
            phone: String,
            office: String
        }
    },
    performance: {
        attendanceRate: Number,
        projectsCompleted: Number,
        fundUtilization: Number,
        publicSatisfaction: Number
    },
    issues: [{
        title: String,
        description: String,
        category: {
            type: String,
            enum: ['Infrastructure', 'Education', 'Healthcare', 'Employment', 'Environment', 'Security', 'Other']
        },
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low']
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    projects: [{
        name: String,
        description: String,
        budget: Number,
        startDate: Date,
        endDate: Date,
        status: {
            type: String,
            enum: ['Planned', 'In Progress', 'Completed', 'Delayed']
        },
        category: {
            type: String,
            enum: ['Infrastructure', 'Education', 'Healthcare', 'Employment', 'Environment', 'Security', 'Other']
        },
        progress: {
            type: Number,
            min: 0,
            max: 100
        },
        impact: String
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Create a 2dsphere index for geospatial queries
ConstituencySchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Constituency', ConstituencySchema);
