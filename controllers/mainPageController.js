const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');
const postModel = require('../models/post');
const replyModel = require('../models/reply');


const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

exports.getMain = (req, res) => {
  const userAuthID = req.cookies.userID;
  userProfile.retrieveUserInfo(userAuthID).then(([data]) => {
    const userData = data[0];
    const postData = [];
    postModel.getAllPosts().then(([postResult]) => {
      replyModel.getAllReplies().then(([replies]) => {
        postResult.forEach((elem) => {
          postData.push({
            post: elem,
            postReplies: replies.filter((reply) => reply.parent === elem.postID),
            currentUserID: userData.userInfoID,
            currentUserProfileUrl: userData.profileUrl,
          });
        });
      });
      res.render('main', {
        pageTitle: 'Knowledge Base - Main Page',
        mainpageCSS: true,
        userInfo: userData,
        posts: postData,
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
