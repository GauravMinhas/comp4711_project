const express = require('express');
const messageController = require('../controllers/MessageController');
const threadController = require('../controllers/ThreadController');

const router = express.Router();

router.get('/direct-message/:id', messageController.getdirectMessage);

router.post('/direct-message/:id', messageController.postdirectMessage);

router.get('/threads', threadController.getThreads);

module.exports = router;
