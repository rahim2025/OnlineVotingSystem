const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Opinion = require('../models/Opinion');

// Get all opinions
router.get('/', async (req, res) => {
    try {
        const opinions = await Opinion.find()
            .populate('author', ['name'])
            .populate('comments.user', ['name'])
            .sort({ createdAt: -1 });
        
        res.render('opinions/index', {
            opinions,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching opinions');
        res.redirect('/');
    }
});

// Show create opinion form
router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('opinions/create');
});

// Create new opinion
router.post('/create', ensureAuthenticated, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
        
        const newOpinion = new Opinion({
            title,
            content,
            author: req.user.id,
            tags: tagArray
        });

        await newOpinion.save();
        req.flash('success_msg', 'Opinion shared successfully');
        res.redirect('/opinions');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error sharing opinion');
        res.redirect('/opinions/create');
    }
});

// View single opinion
router.get('/:id', async (req, res) => {
    try {
        const opinion = await Opinion.findById(req.params.id)
            .populate('author', ['name'])
            .populate('comments.user', ['name']);

        if (!opinion) {
            req.flash('error_msg', 'Opinion not found');
            return res.redirect('/opinions');
        }

        res.render('opinions/show', {
            opinion,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching opinion');
        res.redirect('/opinions');
    }
});

// Add comment
router.post('/:id/comment', ensureAuthenticated, async (req, res) => {
    try {
        const opinion = await Opinion.findById(req.params.id);
        if (!opinion) {
            req.flash('error_msg', 'Opinion not found');
            return res.redirect('/opinions');
        }

        opinion.comments.push({
            user: req.user.id,
            content: req.body.content
        });

        await opinion.save();
        req.flash('success_msg', 'Comment added successfully');
        res.redirect(`/opinions/${req.params.id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error adding comment');
        res.redirect(`/opinions/${req.params.id}`);
    }
});

// Like/Unlike opinion
router.post('/:id/like', ensureAuthenticated, async (req, res) => {
    try {
        const opinion = await Opinion.findById(req.params.id);
        if (!opinion) {
            return res.status(404).json({ success: false });
        }

        const likeIndex = opinion.likes.indexOf(req.user.id);
        if (likeIndex > -1) {
            // Unlike
            opinion.likes.splice(likeIndex, 1);
        } else {
            // Like
            opinion.likes.push(req.user.id);
        }

        await opinion.save();
        res.json({ success: true, likes: opinion.likes.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
