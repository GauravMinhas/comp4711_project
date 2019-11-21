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
  if not, return error message
  */
function userLogin(u) {
  const passwordInput = u.password;
  const emailInput = u.email;
  return new Promise((resolve, reject) => {
    db.execute(`SELECT * FROM userauth WHERE email LIKE '${emailInput}';`).then((data) => {
      if (data[0][0].password === passwordInput) {
        return resolve(data);
      }
      return reject(new Error('Wrong email and password combination'));
    }).catch((error) => {
      console.log(error);
    });
  });
}

module.exports = {
  registerAuth: registerUserAuth,
  registerInfo: registerUserInfo,
  getId: getUserId,
  login: userLogin,
};
