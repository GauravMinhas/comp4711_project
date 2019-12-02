const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

exports.getProfile = (req, res) => {
  const { id } = req.params;
  userProfile.retrieveUserInfo(id).then(([data]) => {
    const userData = data[0];
    userProfile.getUserPosts(id).then((posts) => {
      res.render('profile', {
        pageTitle: `${userData.userName} - Profile`,
        profilepageCSS: true,
        userInfo: userData,
        posts: posts,
        latestPosts: '',
        topicList: [
          'php',
          'nodejs',
          'java',
          'sql',
          'zend',
        ],
      });
    });
  });

};
