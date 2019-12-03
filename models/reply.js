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

// get reply ID
// UNUSED
// function getReplyId(reply) {
//   const data = db.execute(`SELECT id FROM reply WHERE parent == '${reply.parent}'
// AND details LIKE '${reply.details}' AND creator == '${reply.creator}';`);
//   return data[0];
// }

// make a new reply to the post
function addReply(reply) {
  const r = {
    parent: reply.parent,
    details: reply.details,
    creator: reply.creatorID,
  };
  return db.execute(`INSERT INTO reply (parent, details, creatorID) VALUES ('${r.parent}', '${r.details}', '${r.creator}');`);
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
function getReplyList(post) {
  const data = db.execute(`SELECT * FROM post_reply WHERE post == '${post.id}' ORDER BY timeposted DESC;`);
  const list = [];
  let index = 0;
  data.forEach((elem) => {
    list[index] = getReply(elem.reply);
    index += 1;
  });
  return list;
}

module.exports = {
  getReply,
  addReply,
  getReplyList,
  addPostReply,
  updatePostReplyCount,
};
