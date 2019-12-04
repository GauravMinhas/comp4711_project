const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');
const userAuth = require('../models/userAuth');

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

exports.editProfile = (req, res) => {
  const userID = req.cookies.userID;
  userProfile.retrieveUserInfo(userID).then(([data]) => {
    const userData = data[0];
    console.table(userData);
    res.render('edit-profile', {
      data: userData,
      editProfileCSS: true,
    });
  });
};

exports.saveEdit = (req, res) => {
  const userID = req.cookies.userID;

  const userInfoData = {
    userID,
    name: req.body.name,
    profileurl: req.body.profileurl,
    statement_of_intent: req.body.statement_of_intent,
    country: req.body.country,
    dateofbirth: req.body.dateofbirth,
  };
  userAuth.updateUserInfo(userInfoData).then(() => res.redirect(301, '/main'));
};