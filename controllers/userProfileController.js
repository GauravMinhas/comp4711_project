const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

exports.getProfile = (req, res) => {
  const { id } = req.params;
  userProfile.retrieveUserInfo(id).then(([data]) => {
    // const userData = data[0];
    userProfile.getUserPosts(id).then((resp) => {
      console.log(resp);
    });
  });
  //     postModel.getAllPosts().then(([postResult]) => {
  //       console.log(postResult);
  //       res.render('main', {
  //         pageTitle: 'Knowledge Base - Main Page',
  //         mainpageCSS: true,
  //         userInfo: userData,
  //         posts: postResult,
  //         latestPosts: '',
  //         topicList: [
  //           'php',
  //           'nodejs',
  //           'java',
  //           'sql',
  //           'zend',
  //         ],
  //       });
  //     });
  //   });
};
