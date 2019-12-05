const express = require('express');
const postController = require('../controllers/PostController');

const router = express.Router();

/* Adds a post. */
router.post('/addPost', postController.addPost);
router.post('/searchByTopic', postController.getPostsByTopic);
router.post('/searchByTitle', postController.getPostsByTitle);
module.exports = router;
