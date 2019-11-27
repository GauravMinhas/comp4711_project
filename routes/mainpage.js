const express = require('express');

const router = express.Router();

/* Main Page */
router.get('/', (req, res) => {
    res.render('mainpage', {
        pageTitle: 'Knowledge Base - Main Page',
        // loginImageLink: 'images/vector-knowledge.jpg',
        mainpageCSS: true,
    });
});

module.exports = router;
