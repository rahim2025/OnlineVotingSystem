const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { ensureNotAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', function(req, res) {
    res.render('login');
});

// Register Page
router.get('/register', function(req, res) {
    res.render('register');
});

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2, role } = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check pass length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // User exists
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                        role: role || 'voter'
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }));
                }
            });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/elections',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            console.error(err);
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
});

module.exports = router;
