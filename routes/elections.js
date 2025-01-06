const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Election = require('../models/Election');
const User = require('../models/User');

// Get all elections
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const elections = await Election.find()
            .populate('createdBy', ['name', 'email'])
            .populate('candidates.user', ['name', 'email'])
            .sort({ createdAt: -1 });

        res.render('elections/index', { 
            elections,
            currentUser: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching elections');
        res.redirect('/dashboard');
    }
});

// Show create election form
router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('elections/create');
});

// Create new election
router.post('/create', ensureAuthenticated, async (req, res) => {
    try {
        const { name, location, description, endTime } = req.body;
        const newElection = new Election({
            name,
            location,
            description,
            endTime,
            createdBy: req.user.id
        });
        await newElection.save();
        req.flash('success_msg', 'Election created successfully');
        res.redirect('/elections');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error creating election');
        res.redirect('/elections/create');
    }
});

// Show single election
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const election = await Election.findById(req.params.id)
            .populate('createdBy', ['name', 'email'])
            .populate('candidates.user', ['name', 'email']);
        
        if (!election) {
            req.flash('error_msg', 'Election not found');
            return res.redirect('/elections');
        }

        res.render('elections/show', { 
            election,
            currentUser: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching election details');
        res.redirect('/elections');
    }
});

// Stand for election
router.post('/:id/stand', ensureAuthenticated, async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) {
            req.flash('error_msg', 'Election not found');
            return res.redirect('/elections');
        }

        // Check if user is already a candidate
        if (election.candidates.some(c => c.user.toString() === req.user.id)) {
            req.flash('error_msg', 'You are already standing in this election');
            return res.redirect(`/elections/${req.params.id}`);
        }

        const { manifesto } = req.body;
        election.candidates.push({
            user: req.user.id,
            manifesto,
            votes: [],
            voteCount: 0
        });

        await election.save();
        req.flash('success_msg', 'You are now standing in this election');
        res.redirect(`/elections/${req.params.id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error registering as candidate');
        res.redirect(`/elections/${req.params.id}`);
    }
});

// Vote in election
router.post('/:id/vote/:candidateId', ensureAuthenticated, async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) {
            req.flash('error_msg', 'Election not found');
            return res.redirect('/elections');
        }

        const candidate = election.candidates.id(req.params.candidateId);
        if (!candidate) {
            req.flash('error_msg', 'Candidate not found');
            return res.redirect(`/elections/${req.params.id}`);
        }

        // Check if user has already voted for this candidate
        if (candidate.votes.includes(req.user.id)) {
            req.flash('error_msg', 'You have already voted for this candidate');
            return res.redirect(`/elections/${req.params.id}`);
        }

        // Remove vote from other candidates if exists
        election.candidates.forEach(c => {
            const index = c.votes.indexOf(req.user.id);
            if (index > -1) {
                c.votes.splice(index, 1);
                c.voteCount--;
            }
        });

        // Add vote to selected candidate
        candidate.votes.push(req.user.id);
        candidate.voteCount++;

        await election.save();
        req.flash('success_msg', 'Vote cast successfully');
        res.redirect(`/elections/${req.params.id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error casting vote');
        res.redirect(`/elections/${req.params.id}`);
    }
});

module.exports = router;
