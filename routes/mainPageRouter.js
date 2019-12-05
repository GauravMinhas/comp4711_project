const express = require('express');
const mainPageController = require('../controllers/mainPageController');

const router = express.Router();
/* Logs the user out, and redirects to the login page. */
router.post('/logout', (req, res) => {
  res.clearCookie('userID');
  res.redirect(302, '/');
});

/* Working in progress */
router.get('/main', mainPageController.getMain);

router.get('/main/posts', mainPageController.getPosts);

module.exports = router;
