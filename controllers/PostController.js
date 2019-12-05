const express = require('express');
const bodyParser = require('body-parser');
const post = require('../models/post');
const userProfile = require('../models/userProfile');
const replyModel = require('../models/reply');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

/* Inserts a new post into the post table, and also inserts a row into user-post table.
   User post count is incremented by 1, and the user is redirected to the main page. */
exports.addPost = (req, res) => {
  const postData = {
    title: req.body.postSubject,
    details: req.body.postDetail,
    creatorID: req.body.creatorID,
    tags: req.body.postTag,
  };
  post.addPost(postData).then((resp) => {
    const postID = resp[0].insertId;
    post.addUserPost(postData, postID).then(() => {
      post.updateUserPostCount(postData).then(() => {
        res.redirect(301, '/main');
      });
    });
  });
};

// get date in MON DD, YYYY format
function ddmmmyyyy(time) {
  return (new Date(time)).toLocaleDateString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

exports.getPostsByTopic = (req, res) => {
  const postData = [];
  post.searchByTopic(req.body.searchTopic).then(([postResult]) => {
    replyModel.getAllReplies().then(([replies]) => {
      userProfile.getIDAndProfileURL().then(([photos]) => {
        replies.forEach((reply) => {
          reply.creatorProfileURL = photos.find((photo) => photo.userInfoID == reply.creatorID).profileURL;
        });
        postResult.forEach((postDataResult) => {
          postDataResult.creatorProfileURL = photos.find((photo) => photo.userInfoID === postDataResult.creatorID).profileURL;
        });
        postResult.forEach((elem) => {
          postData.push({
            ...elem,
            postReplies: replies.filter((reply) => reply.parent === elem.postID),
            timePosted: ddmmmyyyy(elem.timePosted),
          });
        });
        res.render('searchoutput', {
          posts: postData,
          searchoutputCSS: true,
        });
      });
    });
  });
};

exports.getPostsByTitle = (req, res) => {
  const postData = [];
  post.searchByTitle(req.body.searchTitle).then(([postResult]) => {
    replyModel.getAllReplies().then(([replies]) => {
      userProfile.getIDAndProfileURL().then(([photos]) => {
        replies.forEach((reply) => {
          reply.creatorProfileURL = photos.find((photo) => photo.userInfoID == reply.creatorID).profileURL;
        });
        postResult.forEach((postDataResult) => {
          postDataResult.creatorProfileURL = photos.find((photo) => photo.userInfoID === postDataResult.creatorID).profileURL;
        });
        postResult.forEach((elem) => {
          postData.push({
            ...elem,
            postReplies: replies.filter((reply) => reply.parent === elem.postID),
            timePosted: ddmmmyyyy(elem.timePosted),
          });
        });
        res.render('searchoutput', {
          posts: postData,
          searchoutputCSS: true,
        });
      });
    });
  });
};