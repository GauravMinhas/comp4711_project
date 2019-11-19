const db = require('../database/db.js');

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

module.exports = {
  getinfo: getUserInfo,
};
