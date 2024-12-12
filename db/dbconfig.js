// database configuration
const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  connectionLimit: 10,
});

module.exports = dbConnection.promise();