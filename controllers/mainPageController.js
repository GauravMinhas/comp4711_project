const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');
const postModel = require('../models/post');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

exports.getMain = (req, res) => {
  const userAuthID = req.cookies.userID;
  userProfile.retrieveUserInfo(userAuthID).then(([data]) => {
    /* Sets userInfo data here. */
    // eslint-disable-next-line prefer-destructuring
    req.session.userInfo = data[0];
    const userData = data[0];
    postModel.getAllPosts().then(([postResult]) => {
      console.log(userData);
      res.render('main', {
        pageTitle: 'Knowledge Base - Main Page',
        mainpageCSS: true,
        userInfo: userData,
        posts: postResult,
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
