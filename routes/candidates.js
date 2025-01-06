const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

// Get all candidates
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const candidates = await Candidate.find().populate('user', ['name', 'email']);
        res.render('candidates', { candidates });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Register as candidate
router.post('/register', ensureAuthenticated, async (req, res) => {
    try {
        const { party, manifesto } = req.body;
        
        // Check if already a candidate
        let candidate = await Candidate.findOne({ user: req.user.id });
        if (candidate) {
            req.flash('error_msg', 'You are already registered as a candidate');
            return res.redirect('/dashboard');
        }

        // Create new candidate
        candidate = new Candidate({
            user: req.user.id,
            party,
            manifesto
        });

        await candidate.save();
        
        // Update user role
        await User.findByIdAndUpdate(req.user.id, { role: 'candidate' });

        req.flash('success_msg', 'You are now registered as a candidate');
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Vote for a candidate
router.post('/vote/:id', ensureAuthenticated, async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        
        if (!candidate) {
            req.flash('error_msg', 'Candidate not found');
            return res.redirect('/candidates');
        }

        // Check if user has already voted
        if (candidate.votes.includes(req.user.id)) {
            req.flash('error_msg', 'You have already voted for this candidate');
            return res.redirect('/candidates');
        }

        candidate.votes.push(req.user.id);
        candidate.voteCount += 1;
        await candidate.save();

        req.flash('success_msg', 'Your vote has been recorded');
        res.redirect('/candidates');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
