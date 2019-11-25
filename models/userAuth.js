const db = require('../database/db.js');


// register a user to the userauth table
function registerUserAuth(userData) {
  const sql = `INSERT INTO userauth (email, password) VALUES ('${userData.email}', '${userData.password}');`;
  return db.execute(sql);
}

// put user's information into userinfo table
function registerUserInfo(userData) {
  const sql = `INSERT INTO userinfo (id, name, picture, statement_of_intent, birthday) VALUES ('${userData.id}', '${userData.name}', '${userData.profileurl}', '${userData.statement_of_intent}', '${userData.dateofbirth}');`;
  return db.execute(sql);
}

// get a user's id from userauth table with email
function getUserId(userData) {
  const sql = `SELECT id FROM userauth WHERE email == '${userData.email}';`;
  return db.execute(sql);
}

/* check if the password matches with the email,
  if yes, return the id of the user,
  if not, return error message
  */
function userLogin(userData) {
  const data = {
    email: userData.email,
    password: userData.password,
  };
  return db.execute(`SELECT * FROM userauth WHERE email LIKE '${data.email}';`);
}

/* retrieves user information from userInfo table. */
function getUserInfo(id) {
  return db.execute(`SELECT * FROM userInfo WHERE id LIKE '${id}';`);
}
module.exports = {
  registerAuth: registerUserAuth,
  registerInfo: registerUserInfo,
  getId: getUserId,
  login: userLogin,
  retrieveUserInfo: getUserInfo,
};
