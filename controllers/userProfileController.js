const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');
const userAuth = require('../models/userAuth');
const replyModel = require('../models/reply');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// get date in MON DD, YYYY format
function ddmmmyyyy(time) {
  return (new Date(time)).toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
}

exports.getProfile = (req, res) => {
  /* Id from the param is the userInfoID, therefore made an update
  to the userProfile controller method. */
  const { id } = req.params;
  const showDMButton = req.cookies.userID != id;
  userProfile.retrieveUserInfoWithInfoID(id).then(([data]) => {
    const userData = data[0];
    userProfile.getUserPosts(id).then((posts) => {
      replyModel.getAllReplies().then(([replies]) => {
        userProfile.getIDAndProfileURL().then(([photos]) => {
          replies.forEach(reply => {
            reply.creatorProfileURL = photos.find(photo => photo.userInfoID == reply.creatorID).profileURL;
          });
          posts.forEach((post) => {
            post.creatorProfileURL = photos.find(photo => photo.userInfoID == post.creatorID).profileURL;
            post.postReplies = replies.filter((reply) => reply.parent === post.postID);
            post.timePosted = ddmmmyyyy(post.timePosted);
          });
          res.render('profile', {
            pageTitle: `${userData.userName} - Profile`,
            profilepageCSS: true,
            userInfo: userData,
            showDMButton,
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
};

exports.editProfile = (req, res) => {
  const { userID } = req.cookies;
  userProfile.retrieveUserInfoWithInfoID(userID).then(([data]) => {
    const userData = data[0];
    res.render('edit-profile', {
      data: userData,
      editProfileCSS: true,
    });
  });
};

exports.addLike = (req, res) => {
  const { id } = req.params;
  userProfile.addLike(id).then(() => {
    res.redirect(301, `/user/${id}`)
  });
};

exports.saveEdit = (req, res) => {
  const { userID } = req.cookies;
  const userInfoData = {
    userID,
    name: req.body.name,
    profileurl: req.body.profileurl,
    statement_of_intent: req.body.statement_of_intent,
    country: req.body.country,
    dateofbirth: req.body.dateofbirth,
  };
  userAuth.updateUserInfo(userInfoData).then(() => res.redirect(301, '/main'));
};