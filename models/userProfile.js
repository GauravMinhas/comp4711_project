const db = require('../database/db.js');
const postModel = require('./post');

// get user information with id.
function getUserInfoWithAuth(userAuthID) {
  return db.execute(`SELECT * FROM userinfo WHERE userAuthID LIKE '${userAuthID}';`);
}

// get a list of all the posts from the user.
function getPostList(u) {
  const data = db.execute(`SELECT * FROM user_post WHERE user == '${u.id}';`);
  const list = [];
  let index = 0;
  data.forEach((elem) => {
    list[index] = postModel.getPost(elem.post);
    index += 1;
  });
}

module.exports = {
  retrieveUserInfo: getUserInfoWithAuth,
  getUserPost: getPostList,
};
