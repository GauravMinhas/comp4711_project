const express = require('express');
const profileController = require('../controllers/userProfileController');

const router = express.Router();

/* Adds a post. */
router.get('/user/:id', profileController.getProfile);

module.exports = router;
