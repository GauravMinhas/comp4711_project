const express = require('express');
const messageController = require('../controllers/MessageController');

const router = express.Router();

router.get('/direct-message/:id', messageController.getdirectMessage);

router.post('/direct-message/:id', messageController.postdirectMessage);

module.exports = router;
