const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');
const postModel = require('../models/post');
const replyModel = require('../models/reply');


const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

// get date in MON DD, YYYY format
function ddmmmyyyy(time) {
  return (new Date(time)).toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
}

app.use(bodyParser.json());

exports.getMain = (req, res) => {
  const userInfoID = req.cookies.userID;
  userProfile.retrieveUserInfoWithInfoID(userInfoID).then(([data]) => {
    const userData = data[0];
    const postData = [];
    postModel.getAllPosts().then(([postResult]) => {
      replyModel.getAllReplies().then(([replies]) => {
        userProfile.getIDAndProfileURL().then(([photos]) => {
          replies.forEach(reply => {
            reply.creatorProfileURL = photos.find(photo => photo.userInfoID == reply.creatorID).profileURL;
          })
          postResult.forEach((post) => {
            post.creatorProfileURL = photos.find(photo => photo.userInfoID == post.creatorID).profileURL;
          });
          postResult.forEach((elem) => {
            postData.push({
              ...elem,
              postReplies: replies.filter((reply) => reply.parent === elem.postID),
              timePosted: ddmmmyyyy(elem.timePosted),
            });
          });
          res.render('main', {
            pageTitle: 'Knowledge Base - Main Page',
            mainpageCSS: true,
            userInfo: userData,
            hasMessages: !!userData.threads,
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
    });
  });
};
