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
    creatorID: req.body.replyCreatorID,
    creatorProfileUrl: req.body.creatorProfileUrl,
  };
  reply.addReply(replyData).then(() => {
    reply.addPostReply(replyData).then(() => {
      reply.updatePostReplyCount(replyData).then(() => {
        res.redirect(301, '/main');
      });
    });
  });
};
