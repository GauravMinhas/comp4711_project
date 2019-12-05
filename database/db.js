const mysql = require('mysql2');

const pool = mysql.createPool({
  //host: 'localhost',
  host: 'remotemysql.com',
  
  //database: 'knowledgebase',
  database: 'Yy4mGhRG4h',
 
  //user: 'root',
  user: 'Yy4mGhRG4h',

  //password: '',
  password: 'NKOM12u32y',
});

module.exports = pool.promise();
