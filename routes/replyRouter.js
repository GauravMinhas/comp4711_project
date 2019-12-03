const express = require('express');
const replyController = require('../controllers/replyController');

const router = express.Router();

/* Adds a post. */
router.post('/addReply', replyController.addReply);

module.exports = router;
