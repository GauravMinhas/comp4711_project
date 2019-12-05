const express = require('express');
const bodyParser = require('body-parser');
const reply = require('../models/reply');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

exports.addReply = (req, res) => {
  const replyData = {
    details: req.body.replyDetail,
    parent: req.body.replyParent,
    creatorID: req.cookies.userID,
  };
  reply.addReply(replyData).then((resp) => {
    const replyID = resp[0].insertId;
    reply.addPostReply(replyData, replyID).then(() => {
      reply.updatePostReplyCount(replyData).then(() => {
        res.redirect(301, '/main');
      });
    });
  });
};
