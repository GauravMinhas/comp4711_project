const express = require('express');
const mainPageController = require('../controllers/mainPageController');

const router = express.Router();
/* Logs the user out, and redirects to the login page. */
router.get('/logout', (req, res) => {
  res.redirect(301, '/');
});

/* Working in progress */
router.get('/main', mainPageController.getMain);

module.exports = router;
