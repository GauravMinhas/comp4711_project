const db = require('../database/db.js');


// register a user to the userauth table
function registerUserAuth(u) {
  const sql = `INSERT INTO userauth (email, password) VALUES ('${u.email}', '${u.password}');`;
  return db.execute(sql);
}

// put user's information into userinfo table
function registerUserInfo(u) {
  const sql = `INSERT INTO userinfo (id, name, picture, statement_of_intent, birthday) VALUES ('${u.id}', '${u.name}', '${u.picture}', '${u.statement_of_intent}', '${u.birthday}');`;
  return db.execute(sql);
}

// get a user's id from userauth table with email
function getUserId(u) {
  const sql = `SELECT id FROM userauth WHERE email == '${u.email}';`;
  return db.execute(sql);
}

/* check if the password matches with the email,
  if yes, return the id of the user,
  if not, return -1
  */
function userLogin(u) {
  const passwordInput = u.password;
  const emailInput = u.email;
  const data = db.execute(`SELECT password, id FROM userauth WHERE email LIKE '${emailInput}';`);
  const user = {
    // TODO: check if this is actually how to parse
    password: data[0].password,
    id: data[0].id,
  };
  if (user.password === passwordInput) {
    return user.id;
  }
  return -1;
}

module.exports = {
  registerAuth: registerUserAuth,
  registerInfo: registerUserInfo,
  getId: getUserId,
  login: userLogin,
};
