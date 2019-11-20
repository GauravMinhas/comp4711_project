const db = require('../database/db.js');
const replyModel = require('./reply');

// get a list of all of the reply in a post
function getReplyList(post) {
  const data = db.execute(`SELECT * FROM post_reply WHERE post == '${post.id}' ORDER BY timeposted DESC;`);
  const list = [];
  let index = 0;
  data.forEach((elem) => {
    list[index] = replyModel.getReply(elem.reply);
    index += 1;
  });
  return list;
}

// get everything about a post from id
// used in conjunction with the user-post table.
function getPost(id) {
  const data = db.execute(`SELECT * FROM post WHERE id == '${id}`);
  const post = {
    id: data[0].id,
    title: data[0].title,
    details: data[0].details,
    creator: data[0].creator,
    tags: data[0].tags,
    replycount: data[0].replycount,
    timeposted: data[0].timeposted,
    replyIDList: getReplyList(this),
  };

  return post;
}

// get N latest post from newest to oldest.
function getNLatestPost(n) {
  const data = db.execute(`SELECT * FROM post ORDER BY timeposted ASC LIMIT ${n};`);
  const list = [];
  let index = 0;
  data.forEach((elem) => {
    const post = getPost(elem.id);
    list[index] = post;
    index += 1;
  });
  return list;
}

/*
TODO: is there a better way for this? What other property can we use to get the post's id?
What if the user accidentally made the same post (same title, details, creator, and tags) twice?
This is mostly used for reply.
*/
function getPostId(post) {
  const id = db.execute(`SELECT id FROM post WHERE title == '${post.title}' AND details == '${post.details}' AND creator == '${post.creator}' AND tags == '${post.tags}';`);
  return id[0];
}


// make a new post
function newPost(post, user) {
  const p = {
    title: post.title,
    details: post.details,
    creator: user.id,
    tags: post.tags,
  };
  const sql = `INSERT INTO post (title, details, creator, tags) VALUES ('${p.title}', '${p.details}', '${p.creator}', '${p.tags}');`;
  db.execute(sql).then(() => {
    db.execute(`UPDATE TABLE user SET postcount = postcount + 1 WHERE id == '${p.creator}';`);
  });
}

module.exports = {
  getPost,
  getPostId,
  getPostReply: getReplyList,
  newPost,
  latestPost: getNLatestPost,
};
