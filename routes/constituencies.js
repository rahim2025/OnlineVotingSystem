const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Constituency = require('../models/Constituency');

// Get all constituencies
router.get('/', async (req, res) => {
    try {
        const constituencies = await Constituency.find()
            .select('name division district code coordinates currentRepresentative');
        
        res.render('constituencies/index', {
            constituencies,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching constituencies');
        res.redirect('/');
    }
});

// Get constituencies by division
router.get('/division/:division', async (req, res) => {
    try {
        const constituencies = await Constituency.find({ division: req.params.division });
        res.json(constituencies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single constituency
router.get('/:code', async (req, res) => {
    try {
        const constituency = await Constituency.findOne({ code: req.params.code });
        
        if (!constituency) {
            req.flash('error_msg', 'Constituency not found');
            return res.redirect('/constituencies');
        }

        // Get nearby constituencies
        const nearbyConstituencies = await Constituency.find({
            coordinates: {
                $near: {
                    $geometry: constituency.coordinates,
                    $maxDistance: 50000 // 50km radius
                }
            },
            code: { $ne: constituency.code }
        }).limit(3).select('name code');

        res.render('constituencies/show', {
            constituency,
            nearbyConstituencies,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching constituency details');
        res.redirect('/constituencies');
    }
});

// Report an issue (requires authentication)
router.post('/:code/issues', ensureAuthenticated, async (req, res) => {
    try {
        const constituency = await Constituency.findOne({ code: req.params.code });
        if (!constituency) {
            return res.status(404).json({ error: 'Constituency not found' });
        }

        const { title, description, category, priority } = req.body;
        constituency.issues.push({
            title,
            description,
            category,
            priority,
            status: 'Pending'
        });

        await constituency.save();
        res.json({ success: true, message: 'Issue reported successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get constituency statistics
router.get('/:code/stats', async (req, res) => {
    try {
        const constituency = await Constituency.findOne({ code: req.params.code })
            .select('demographics performance projects');
        
        if (!constituency) {
            return res.status(404).json({ error: 'Constituency not found' });
        }

        // Calculate project statistics
        const projectStats = {
            total: constituency.projects.length,
            completed: constituency.projects.filter(p => p.status === 'Completed').length,
            inProgress: constituency.projects.filter(p => p.status === 'In Progress').length,
            planned: constituency.projects.filter(p => p.status === 'Planned').length,
            byCategory: {}
        };

        constituency.projects.forEach(project => {
            if (!projectStats.byCategory[project.category]) {
                projectStats.byCategory[project.category] = 0;
            }
            projectStats.byCategory[project.category]++;
        });

        res.json({
            demographics: constituency.demographics,
            performance: constituency.performance,
            projectStats
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
