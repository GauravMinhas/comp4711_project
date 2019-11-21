const express = require('express');
const userAuthController = require('../controllers/userAuthController');
// testing
const test = require('../controllers/postController');

const router = express.Router();

/* Initial Login Page */
router.get('/', (req, res) => {
  res.render('login', {
    pageTitle: 'Knowledge Base - Login',
    loginImageLink: 'images/vector-knowledge.jpg',
    loginCSS: true,
  });
});

router.post('/main', userAuthController.login);

router.post('/register', userAuthController.signup);

router.post('/', userAuthController.register);

router.post('/test', test.addPost);

module.exports = router;
