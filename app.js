const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log('MongoDB Atlas Connected...');
    // Seed constituencies
    const seedConstituencies = require('./seeds/constituencySeeds');
    seedConstituencies();
})
.catch(err => console.log('MongoDB connection error:', err));

// Passport Config
require('./config/passport')(passport);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions', // Collection where sessions will be stored
            ttl: 24 * 60 * 60, // Session TTL (1 day)
            autoRemove: 'native', // Enable automatic removal of expired sessions
            crypto: {
                secret: process.env.SESSION_SECRET || 'secret'
            }
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000 // Cookie TTL (1 day)
        }
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/elections', require('./routes/elections'));
app.use('/opinions', require('./routes/opinions'));
app.use('/constituencies', require('./routes/constituencies'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    console.log(`Server running on port ${PORT}`);
});
