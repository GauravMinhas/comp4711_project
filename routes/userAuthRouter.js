const express = require('express');
<<<<<<< HEAD:routes/userAuthRouter.js
const userAuthController = require('../controllers/userAuthController');
// testing
const test = require('../controllers/PostController');

=======
const userAuthController = require('../../controllers/userAuthController');
>>>>>>> 86edcddefc37806c164429d208e0e779c888cd1a:routes/login/userAuthRouter.js

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
router.get('/test', test.getAllPost);


module.exports = router;
