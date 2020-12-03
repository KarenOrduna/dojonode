require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // address of the server
  user: process.env.DB_USER, // username
  port: process.env.DB_PORT, // PORT 3309 mysql workbench + Docker
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = connection;
