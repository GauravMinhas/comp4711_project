const db = require('../database/db.js');
const postModel = require('./post');

// get user information with id.
function getUserInfoWithAuth(userAuthID) {
  return db.execute(`SELECT * FROM userinfo WHERE userAuthID = '${userAuthID}';`);
}

function getUserInfoWithInfo(userInfoID) {
  return db.execute(`SELECT * FROM userinfo WHERE userInfoID = '${userInfoID}';`);
}

// get a list of all the posts from the user.
function getPostList(id) {
  return (postModel.getPostsByUser(id)).then((res) => {
    return Promise.all(res);
  });
}

function getNameAndPhoto(userAuthID) {
  return db.execute(`SELECT userName, profileURL FROM userinfo WHERE userAuthID = '${userAuthID}';`);
}

module.exports = {
  retrieveUserInfo: getUserInfoWithAuth,
  retrieveUserInfoWithInfoID: getUserInfoWithInfo,
  getUserPosts: getPostList,
  getNameAndPhoto,
};
