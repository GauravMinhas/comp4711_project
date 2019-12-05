const express = require('express');
const bodyParser = require('body-parser');
const post = require('../models/post');
const userProfile = require('../models/userProfile');

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

exports.getPostsByTopic = (req, res) => {
  post.searchByTopic(req.body.searchTopic).then(([postResult]) => {
    userProfile.getIDAndProfileURL().then(([photos]) => {
      postResult.forEach((postData) => {
        postData.creatorProfileURL = photos.find((photo) => photo.userInfoID === postData.creatorID).profileURL;
      });
      res.render('searchoutput', {
        posts: postResult,
        searchoutputCSS: true,
      });
    });
  });
};

exports.getPostsByTitle = (req, res) => {
  post.searchByTitle(req.body.searchTitle).then(([postResult]) => {
    userProfile.getIDAndProfileURL().then(([photos]) => {
      postResult.forEach((postData) => {
        postData.creatorProfileURL = photos.find((photo) => photo.userInfoID === postData.creatorID).profileURL;
      });
      res.render('searchoutput', {
        posts: postResult,
        searchoutputCSS: true,
      });
    });
  });
};
