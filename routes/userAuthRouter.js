const express = require('express');
const userAuthController = require('../controllers/userAuthController');

const router = express.Router();

/* Initial Login Page */
router.get('/', (req, res) => {
  res.render('login', {
    pageTitle: 'Knowledge Base - Login',
    loginImageLink: 'images/vector-knowledge.jpg',
    loginCSS: true,
    loginFailed: false,
    noExistingUser: false,
  });
});
/* Route for existing users to directly log in to the main page. */
router.post('/main', userAuthController.login);

/* After initial information, routes the user to registration page for more data capture. */
router.post('/register', userAuthController.register);

/* After all data capturing is complete, leads the user to the main page. */
router.post('/signup', userAuthController.signup);


module.exports = router;
