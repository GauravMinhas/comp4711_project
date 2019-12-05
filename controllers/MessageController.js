const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');
const messages = require('../models/message');
const threads = require('../models/thread');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

exports.getdirectMessage = (req, res) => {
  const { id: recieverID } = req.params;
  userProfile.retrieveUserInfoWithInfoID(recieverID).then(([data]) => {
    const userData = data[0];
    res.render('direct-message', {
      pageTitle: `Message ${userData.userName}`,
      dmpageCSS: true,
      userInfo: userData,
    });
  });
};

exports.postdirectMessage = (req, res) => {
  const { id: recieverID } = req.params;
  const senderID = req.cookies.userID;
  const message = `${req.body.subject}\n${req.body.message}`;
  threads.getThreadIDFromUsersID(senderID, recieverID).then(([data]) => {
    if (!data.length) {
      threads.insertThread(senderID, recieverID)
        .then((threadID) => {
          messages.insertMessage(threadID, senderID, message)
            .then(() => res.redirect(301, `/user/${recieverID}`));
        });
    } else {
      messages.insertMessage(data[0].threadID, senderID, message)
        .then(() => res.redirect(301, `/user/${recieverID}`));
    }
  });
};

exports.postThreadMessage = (req, res) => {
  const { id: recieverID } = req.params;
  const senderID = req.cookies.userID;
  const { message } = req.body;
  threads.getThreadIDFromUsersID(senderID, recieverID).then(([data]) => {
    if (!data.length) {
      threads.insertThread(senderID, recieverID)
        .then((threadID) => {
          messages.insertMessage(threadID, senderID, message)
            .then(() => res.redirect(301, `/user/${recieverID}`));
        });
    } else {
      const { threadID } = data[0]
      messages.insertMessage(threadID, senderID, message)
        .then(() => res.redirect(301, `/threads/${threadID}`));
    }
  });
};
