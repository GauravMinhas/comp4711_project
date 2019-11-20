const express = require('express');
const bodyParser = require('body-parser');
const post = require('../models/post');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

// make a new post
exports.newPost = (req, res) => {
  const postData = {
    title: `${req.body.postTitle}`,
    details: `${req.body.postDetails}`,
    creator: `${req.body.postCreator}`,
    tags: `${req.body.tags}`,
  };
  postData.forEach((elem) => {
    if (elem === undefined || elem === '' || elem == null) {
      throw new Error('Post needs a title and contents');
    }
  });
  post.newPost(postData).then(() => {
    res.redirect('/main');
  }).catch((error) => {
    console.WriteLine(error);
  });
};

// load the newest [5]-hardcoded for now- posts.
exports.getLatestPost = (req, res) => {
  const topFivePost = post.latestPost(5).then(() => res.render('latestPostPartial', { latestPosts: topFivePost }));
};
