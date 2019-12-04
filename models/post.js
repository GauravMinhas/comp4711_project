const db = require('../database/db.js');
// const replyModel = require('./reply');


// get everything about a post from id
// used in conjunction with the user-post table.
function getPost(id) {
  return db.execute(`SELECT * FROM post WHERE postID = '${id}'`)
    .then(([data]) => {
      const post = {
        id: data[0].postID,
        title: data[0].title,
        details: data[0].details,
        creator: data[0].creatorID,
        creatorProfileUrl: data[0].creatorProfileUrl,
        tags: data[0].tags,
        replyCount: data[0].replyCount,
        timeposted: data[0].timePosted,
        // replyList: replyModel.getReplyList(this),
      };
      return post;
    });
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
  const sql = 'INSERT INTO post (title, details, creatorID, creatorProfileUrl, tags) VALUES (?, ?, ?, ?, ?);';
  /* Replaced to db.query, to allow apostrophe input. */
  // eslint-disable-next-line max-len
  return db.query(sql, [post.title, post.details, post.creatorID, post.creatorProfileUrl, post.tags]);
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

// get all the posts made by the user
function getPostsByUser(id) {
  const sql = `SELECT * FROM user_post WHERE userID = '${id}';`;
  const list = [];
  return db.execute(sql).then(([resp]) => {
    resp.forEach((elem) => {
      list.push(getPost(elem.postID));
    });
    return list;
  });
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
  getPostsByUser,
};
