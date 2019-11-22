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

  post.addPost(postData).then(() => {
    post.newUserPost(postData);
  }).then(() => {
    post.incrementPostCount(postData);
  }).then(() => {
    res.redirect('/main');
  })
    .catch((error) => {
      console.log(error);
    });
};

// load all of the posts
exports.getAllPost = (req, res) => {
  post.getAllPost().then((data) => {
    const rawPostData = data[0];
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
        replyList: elem.replyList,
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
