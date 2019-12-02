const db = require('../database/db.js');
const postModel = require('./post');

// get user information with id.
function getUserInfoWithAuth(userAuthID) {
  return db.execute(`SELECT * FROM userinfo WHERE userAuthID = '${userAuthID}';`);
}

// get a list of all the posts from the user.
function getPostList(id) {
  return (postModel.getPostsByUser(id)).then(res => {
    return Promise.all(res);
  });
}

module.exports = {
  retrieveUserInfo: getUserInfoWithAuth,
  getUserPosts: getPostList,
};
