const express = require('express');
const bodyParser = require('body-parser');
const post = require('../models/post');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

// make a new post
exports.addPost = (req, res) => {
  const postData = {
    title: `${req.body.title}`,
    details: `${req.body.details}`,
    creator: `${req.body.creator}`,
    tags: `${req.body.tags}`,
  };

  // for (elem in postData) {
  //   if (elem === undefined || elem === '' || elem == null) {
  //     throw new Error('Post needs a title and contents');
  //   }
  // }

  post.addPost(postData).then(() => {
    res.redirect('/main');
  }).catch((error) => {
    console.log(error);
  });
};

// load the newest [5]-hardcoded for now- posts.
exports.getLatestPost = (req, res) => {
  const topFivePost = post.latestPost(5).then(() => {
    res.render('latestPostPartial', { latestPosts: topFivePost });
  }).catch((error) => {
    console.log(error);
  });
};
