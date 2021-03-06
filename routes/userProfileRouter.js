const express = require('express');
const profileController = require('../controllers/userProfileController');

const router = express.Router();

/* Adds a post. */
router.get('/user/:id', profileController.getProfile);

router.get('/edit-profile', profileController.editProfile);

router.post('/edit-profile', profileController.saveEdit);

router.post('/like/:id', profileController.addLike);

module.exports = router;
