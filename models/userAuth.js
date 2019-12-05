const db = require('../database/db.js');


// register a user to the userauth table
function registerUserAuth(userData) {
  const sql = `INSERT INTO userauth (email, userPassword) VALUES ('${userData.email}', '${userData.password}');`;
  return db.execute(sql);
}

// put user's information into userinfo table
function registerUserInfo(userData) {
  const sql = `INSERT INTO userinfo (userAuthID, userName, profileUrl, statementOfIntent, country, dateOfBirth) VALUES (last_insert_id(), '${userData.name}', '${userData.profileurl}',?, ?, '${userData.dateofbirth}');`;
  /* User's statement of intent is taken out as a query parameter to allow apostrophe inputs. */
  return db.query(sql, [userData.statement_of_intent, userData.country]);
}

// put updated user's information into userinfo table
function updateUserInfo(userData) {
  const sql = `UPDATE  userinfo SET userName = '${userData.name}', profileUrl = '${userData.profileurl}',statementOfIntent = '${userData.statement_of_intent}', country = '${userData.country}', dateOfBirth ='${userData.dateofbirth}' WHERE userInfoID = '${userData.userID}';`;
  return db.execute(sql);
}

// get a user's id from userauth table with email
function getUserId(userData) {
  const sql = `SELECT userAuthID FROM userauth WHERE email LIKE '${userData.email}';`;
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

// just in case
function dropUserAuth(userData) {
  const data = {
    email: userData.email,
    password: userData.password,
  };
  db.execute(`DELETE FROM userauth WHERE email LIKE '${data.email}' AND userPassword LIKE '${data.password}';`);
}


module.exports = {
  registerAuth: registerUserAuth,
  registerInfo: registerUserInfo,
  getId: getUserId,
  login: userLogin,
  dropUserAuth,
  updateUserInfo
};
