// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'us-cdbr-iron-east-05.cleardb.net',
//     database: 'heroku_2a56852066e66c2',
//     user: 'bf4ff8809dd3d2',
//     password: "7e843291",
//   });


// module.exports = pool.promise();

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'peoplebook',
  password: '',
});

module.exports = pool.promise();
