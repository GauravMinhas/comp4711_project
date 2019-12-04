const db = require('../database/db.js');
// const postModel = require('./post');

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

// make a new reply to the post
/* Reply details need to allow apostrophe inputs, therefore
   switched from db.execute to db.query. */
function addReply(reply) {
  const r = {
    parent: reply.parent,
    details: reply.details,
    creator: reply.creatorID,
    creatorProfileUrl: reply.creatorProfileUrl,
  };
  const sql = 'INSERT INTO reply (parent, details, creatorID, creatorProfileUrl) VALUES (?, ?, ?, ?);';
  return db.query(sql, [r.parent, r.details, r.creator, r.creatorProfileUrl]);
}

function addPostReply(reply) {
  return new Promise((resolve, reject) => {
    resolve(db.execute(`INSERT INTO post_reply (postID, replyID) VALUES ('${reply.parent}', last_insert_id());`))
      .catch(() => {
        reject(new Error('post_reply table update failure.'));
      });
  });
}

function updatePostReplyCount(reply) {
  return db.execute(`UPDATE post SET replyCount = replyCount + 1 WHERE postID LIKE '${reply.parent}';`);
}


// get a list of all of the reply in a post
function getPostReplies(post) {
  return db.execute(`SELECT * FROM post_reply WHERE post == '${post.id}' ORDER BY timeposted DESC;`);
}

function getAllReplies() {
  const sql = 'SELECT * FROM reply';
  return db.execute(sql);
}

module.exports = {
  getReply,
  addReply,
  getPostReplies,
  addPostReply,
  updatePostReplyCount,
  getAllReplies,
};
