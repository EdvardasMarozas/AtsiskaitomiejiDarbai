var mysql = require("mysql2/promise");

const db = mysql.createPool({
  connectionLimit: 50,
  waitForConnections: true,
  queueLimit: 0,

  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

module.exports = db;