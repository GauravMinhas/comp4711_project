const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

exports.getProfile = (req, res) => {
/* Id from the param is the userInfoID, therefore made an update
to the userProfile controller method. */
  const { id } = req.params;
  userProfile.retrieveUserInfoWithInfoID(id).then(([data]) => {
    const userData = data[0];
    userProfile.getUserPosts(id).then((posts) => {
      res.render('profile', {
        pageTitle: `${userData.userName} - Profile`,
        profilepageCSS: true,
        userInfo: userData,
        posts,
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
