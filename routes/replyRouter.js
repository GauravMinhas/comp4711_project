const express = require('express');
const replyController = require('../controllers/replyController');

const router = express.Router();

// router.get('/:id/replies', replyController.showReplies);
/* Adds a post. */
router.post('/addReply', replyController.addReply);

module.exports = router;
