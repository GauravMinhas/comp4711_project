const db = require('../database/db.js');
const postModel = require('./post');

// get user information with id.
function getUserInfo(u) {
  const data = db.execute(`SELECT * FROM userinfo WHERE id == '${u.id}';`);
  if (data == null) {
    return -1;
  }

  const user = {
    id: data[0].id,
    name: data[0].name,
    picture: data[0].picture,
    statement_of_intent: data[0].statement_of_intent,
    posts: data[0].posts,
    stars: data[0].stars,
    threads: data[0].threads,
    birthday: data[0].birthday,
  };
  return user;
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
  getInfo: getUserInfo,
  getUserPost: getPostList,
};
