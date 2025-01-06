const express = require('express');
const router = express.Router();
const axios = require('axios');
const { ensureAuthenticated } = require('../config/auth');

// Home page
router.get('/', async (req, res) => {
    try {
        const newsApiKey = '67664f273b37426db6c4e22fb42dfe0e';
        const newsResponse = await axios.get(`https://newsapi.org/v2/top-headlines?language=en&apiKey=${newsApiKey}`);
        const news = newsResponse.data.articles.slice(0, 6); // Get top 6 news

        res.render('welcome', {
            user: req.user,
            news: news
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.render('welcome', {
            user: req.user,
            news: []
        });
    }
});

module.exports = router;
