const express = require('express');
const bodyParser = require('body-parser');
const post = require('../models/post');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

/* Inserts a new post into the post table, and also inserts a row into user-post table.
   User post count is incremented by 1, and the user is redirected to the main page. */
exports.addPost = (req, res) => {
  const postData = {
    title: `${req.body.postSubject}`,
    details: `${req.body.postDetail}`,
    creatorID: `${req.body.creatorID}`,
    creatorProfileUrl: `${req.body.creatorProfileUrl}`,
    tags: `${req.body.postTag}`,
  };
  post.addPost(postData).then(() => {
    post.addUserPost(postData).then(() => {
      post.updateUserPostCount(postData).then(() => {
        res.redirect(301, '/main');
      });
    });
  });
};

exports.getPostsByTopic = (req, res) => {
  post.searchByTopic(req.body.searchTopic).then(([postResult]) => {
    res.render('searchoutput', {
      posts: postResult,
      searchoutputCSS: true,
    });
  });
};

exports.getPostsByTitle = (req, res) => {
  post.searchByTitle(req.body.searchTitle).then(([postResult]) => {
    res.render('searchoutput', {
      posts: postResult,
      searchoutputCSS: true,
    });
  });
};

// load all of the posts
exports.getAllPost = (req, res) => {
  post.getAllPosts().then((data) => {
    const rawPostData = data[0];
    console.log(data[0]);
    const postData = [];
    let index = 0;
    rawPostData.forEach((elem) => {
      const p = {
        id: elem.id,
        title: elem.title,
        details: elem.details,
        tags: elem.tags,
        replycount: elem.replycount,
        timeposted: elem.timeposted,
      };
      postData[index] = p;
      index += 1;
    });
    console.log(postData);
    res.render('postPartial', { postData });
  }).catch((error) => {
    console.log(error);
  });
};
