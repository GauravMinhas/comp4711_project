const express = require('express');
const userAuthController = require('../controllers/userAuthController');
// testing
const test = require('../controllers/PostController');


const router = express.Router();

/* Initial Login Page */
router.get('/', (req, res) => {
  res.render('login', {
    pageTitle: 'Knowledge Base - Login',
    loginImageLink: 'images/vector-knowledge.jpg',
    loginCSS: true,
  });
});
/* Route for existing users to directly log in to the main page. */
router.post('/login', userAuthController.login);

/* After initial information, routes the user to registration page for more data capture. */
router.post('/register', userAuthController.register);

/* After all data capturing is complete, leads the user to the main page. */
router.post('/main', userAuthController.signup);

router.post('/test', test.addPost);
router.get('/test', test.getAllPost);


module.exports = router;