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

function checkValid(req, res) {
  if (!req.cookies.userID) {
    res.redirect(302, '/');
    return false;
  }
  return true;
}

exports.getMain = (req, res) => {
  if (checkValid(req, res)) {
    const userInfoID = req.cookies.userID;
    userProfile.retrieveUserInfoWithInfoID(userInfoID).then(([data]) => {
      const userData = data[0];
      const postData = [];
      let myPostCount = 0;
      postModel.getAllPosts().then(([postResult]) => {
        replyModel.getAllReplies().then(([replies]) => {
          userProfile.getIDAndProfileURL().then(([photos]) => {
            replies.forEach((reply) => {
              reply.creatorProfileURL = photos.find((photo) => photo.userInfoID == reply.creatorID).profileURL;
            });
            postResult.forEach((post) => {
              post.creatorProfileURL = photos.find((photo) => photo.userInfoID == post.creatorID).profileURL;
            });
            postResult.forEach((elem) => {
              if (elem.creatorID == userInfoID) myPostCount++;
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
              hasMessages: !!(userData && userData.threads),
              hasPosts: myPostCount != 0,
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
  }
};

exports.getPosts = (req, res) => {
  if (checkValid(req, res)) {
    const userInfoID = req.cookies.userID;
    userProfile.retrieveUserInfoWithInfoID(userInfoID).then(([data]) => {
      const userData = data[0];
      userProfile.getUserPosts(userInfoID).then((posts) => {
        replyModel.getAllReplies().then(([replies]) => {
          userProfile.getIDAndProfileURL().then(([photos]) => {
            replies.forEach((reply) => {
              reply.creatorProfileURL = photos.find((photo) => photo.userInfoID == reply.creatorID).profileURL;
            });
            posts.forEach((post) => {
              post.creatorProfileURL = photos.find((photo) => photo.userInfoID == post.creatorID).profileURL;
              post.postReplies = replies.filter((reply) => reply.parent === post.postID);
              post.timePosted = ddmmmyyyy(post.timePosted);
            });
            res.render('main-posts', {
              pageTitle: 'Knowledge Base - Posts Page',
              mainpageCSS: true,
              userInfo: userData,
              hasMessages: !!(userData && userData.threads),
              posts,
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
  }
}