const db = require('../database/db.js');
const postModel = require('./post');

// get everything about a reply from id
// used in conjunction with the post-reply table
function getReply(id) {
  const data = db.execute(`SELECT * FROM reply WHERE id == '${id}`);
  const reply = {
    id: data[0].id,
    parent: data[0].parent,
    details: data[0].details,
    creator: data[0].creator,
    timeposted: data[0].timeposted,
  };
  return reply;
}

// make a new replay to the post
function newReply(reply, post, user) {
  const r = {
    parent: postModel.getPostId(post),
    details: reply.details,
    creator: user.id,
  };
  const sql = `INSERT INTO reply (parent, details, creator) VALUES ('${r.parent}', '${r.details}', '${r.creator}');`;
  db.execute(sql).then(
    db.execute(`ALTER TABLE post SET replycount = replycount + 1 WHERE id == '${r.parent}'`),
  );
}


module.exports = {
  getReply,
  newReply,
};
