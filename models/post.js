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
function getAllPosts() {
  return db.execute('SELECT * FROM post ORDER BY timeposted DESC;');
}

/*
TODO: is there a better way for this? What other property can we use to get the post's id?
What if the user accidentally made the same post (same title, details, creator, and tags) twice?
This is mostly used for reply.
*/
function getPostId(post) {
  return db.execute(`SELECT postID FROM post WHERE title LIKE '${post.title}' AND details LIKE '${post.details}' AND creatorID LIKE '${post.creator}' AND tags LIKE '${post.tags}';`);
}


// make a new post
function addPost(post) {
  const p = {
    title: post.title,
    details: post.details,
    creator: post.creatorID,
    creatorProfileUrl: post.creatorProfileUrl,
    tags: post.tags,
  };
  const sql = `INSERT INTO post (title, details, creatorID, creatorProfileUrl, tags) VALUES ('${p.title}', '${p.details}', '${p.creator}', '${p.creatorProfileUrl}', '${p.tags}');`;
  return db.execute(sql);
}

// update user_post table with new post
async function addUserPost(postData) {
  return new Promise((resolve, reject) => {
    resolve(db.execute(`INSERT INTO user_post (userID, postID) VALUES ('${postData.creatorID}', last_insert_id());`))
      .catch(() => {
        reject(new Error('user_post table update failure.'));
      });
  });
}


// increment posts in userinfo
function updateUserPostCount(postData) {
  return db.execute(`UPDATE userinfo SET posts = posts + 1 WHERE userInfoID LIKE '${postData.creatorID}';`);
}

// search post by tag
function searchTag(tag) {
  const sql = `SELECT * FROM post WHERE tags LIKE '${tag}' ORDER BY timeposted DESC;`;
  return db.execute(sql);
}

// search post by title
function searchTitle(title) {
  const sql = `SELECT * FROM post WHERE title LIKE '%${title}%' ORDER BY timeposted DESC;`;
  return db.execute(sql);
}

module.exports = {
  getPost,
  getPostId,
  addPost,
  getAllPosts,
  searchByTopic: searchTag,
  searchByTitle: searchTitle,
  addUserPost,
  updateUserPostCount,
};
