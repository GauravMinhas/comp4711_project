const db = require('../database/db.js');
const postModel = require('./post');

// get user information with id.
function getUserInfoWithAuth(userAuthID) {
  return db.execute(`SELECT * FROM userinfo WHERE userAuthID LIKE '${userAuthID}';`);
}

// get a list of all the posts from the user.
function getPostList(id) {
  const data = db.execute(`SELECT * FROM user_post WHERE user == '${id}';`);
  const list = [];
  let index = 0;
  data.then(([resp]) => {
    resp.forEach(async (elem) => {
      list[index] = await postModel.getPost(elem.post);
      index += 1;
    });
    return list;
  });
}

module.exports = {
  retrieveUserInfo: getUserInfoWithAuth,
  getUserPosts: getPostList,
};
