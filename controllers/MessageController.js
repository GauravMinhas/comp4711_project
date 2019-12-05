const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const userProfile = require('../models/userProfile');
const messages = require('../models/message');
const threads = require('../models/thread');
const userAuth = require('../models/userAuth');


const transport = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 2525,
  auth: {
    user: 'ravatag207@mailt.net',
    pass: 'vrOrMNXWKNH4',
  },
});

function sendMail(reciever, sender, subject, text) {
  const message = {
    from: sender, // Sender address
    to: reciever, // List of recipients
    subject, // Subject line
    text, // Plain text body
  };
  transport.sendMail(message, (err, info) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } else {
      // eslint-disable-next-line no-console
      console.log(info);
    }
  });
}

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

function checkValid(req, res) {
  if (!req.cookies.userID) {
    res.redirect(302, '/');
    return false;
  }
  return true;
}

exports.getdirectMessage = (req, res) => {
  if (checkValid(req, res)) {
    const { id: recieverID } = req.params;
    userProfile.retrieveUserInfoWithInfoID(recieverID).then(([data]) => {
      const userData = data[0];
      res.render('direct-message', {
        pageTitle: `Message ${userData.userName}`,
        dmpageCSS: true,
        userInfo: userData,
      });
    });
  }
};

exports.postdirectMessage = (req, res) => {
  if (checkValid(req, res)) {
    const { id: recieverID } = req.params;
    const senderID = req.cookies.userID;
    const message = `${req.body.subject}\n${req.body.message}`;
    userAuth.getEmailFromUserInfoID(senderID).then((senderMail) => {
      userAuth.getEmailFromUserInfoID(recieverID).then((recieverMail) => {
        sendMail(recieverMail, senderMail, req.body.subject, req.body.message);
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
      });
    });
  }
};

exports.postThreadMessage = (req, res) => {
  if (checkValid(req, res)) {
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
        const { threadID } = data[0];
        messages.insertMessage(threadID, senderID, message)
          .then(() => res.redirect(301, `/threads/${threadID}`));
      }
    });
  }
};
