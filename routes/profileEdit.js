const express = require('express');

const router = express.Router();

/* Main Page */
router.get('/', (req, res) => {
    res.render('profileEdit', {
        pageTitle: 'Knowledge Base - profileEdit Page',
        // loginImageLink: 'images/vector-knowledge.jpg',
        profileEditCSS: true,
    });
});

module.exports = router;
