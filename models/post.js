const db = require('../database/db.js');
const replyModel = require('./reply');


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
    replyList: replyModel.getReplyList(this),
  };

  return post;
}

// get N latest post from newest to oldest.
function getNLatestPost(n) {
  const data = db.execute(`SELECT * FROM post ORDER BY timeposted DESC LIMIT ${n};`);
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
  const id = db.execute(`SELECT id FROM post WHERE title LIKE '${post.title}' AND details LIKE '${post.details}' AND creator LIKE '${post.creator}' AND tags LIKE '${post.tags}';`);
  return id[0];
}


// make a new post
function addPost(post) {
  const p = {
    title: post.title,
    details: post.details,
    creator: post.creator,
    tags: post.tags,
  };
  console.log(p.creator);
  const sql = `INSERT INTO post (title, details, creator, tags) VALUES ('${p.title}', '${p.details}', '${p.creator}', '${p.tags}');`;
  return db.execute(sql).then(() => {
    db.execute(`INSERT INTO user_post (id, post) VALUES ('${p.creator}', '${getPostId(p)}');`);
  }).then(() => {
    db.execute(`UPDATE TABLE user SET postcount = postcount + 1 WHERE id == '${p.creator}';`);
  });
}

// search post by tag
function searchTag(tag) {
  const sql = `SELECT * FROM post WHERE tags LIKE '${tag}';`;
  const data = db.execute(sql);
  if (data === undefined || data == null) {
    return [];
  }
  const list = [];
  let index = 0;
  data.forEach((p) => {
    list[index] = getPost(p.id);
    index += 1;
  });
  return list;
}

// search post by title
function searchTitle(title) {
  const sql = `SELECT * FROM post WHERE tags LIKE '%${title}%';`;
  const data = db.execute(sql);
  if (data === undefined || data == null) {
    return [];
  }
  const list = [];
  let index = 0;
  data.forEach((p) => {
    list[index] = getPost(p.id);
    index += 1;
  });
  return list;
}

module.exports = {
  getPost,
  getPostId,
  addPost,
  latestPost: getNLatestPost,
  searchTag,
  searchTitle,
};
