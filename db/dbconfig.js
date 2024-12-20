// database configuration
const mysql2 = require("mysql2"); //importing mysql2 from node it uses as abridge between mysqldatabase and node


//Instead of a single connection, a connection pool maintains multiple connections to the database.
const dbConnection = mysql2.createPool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  connectionLimit: 10,
});

// Promisify the connection for async/await usage
const db = dbConnection.promise();

// Table creation queries
const createTables = async () => {
  try {
    // Users Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        userid INT(20) NOT NULL AUTO_INCREMENT,
        username VARCHAR(20) NOT NULL UNIQUE,
        firstname VARCHAR(20) NOT NULL,
        lastname VARCHAR(20) NOT NULL,
        email VARCHAR(40) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        PRIMARY KEY(userid)
      );
    `);

    // Questions Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT(20) NOT NULL AUTO_INCREMENT,
        questionid VARCHAR(100) NOT NULL UNIQUE,
        userid INT(20) NOT NULL,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(200) NOT NULL,
        tag VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id, questionid),
        FOREIGN KEY(userid) REFERENCES users(userid) ON DELETE CASCADE
      );
    `);

    // Answers Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS answers (
        answerid INT(20) NOT NULL AUTO_INCREMENT,
        userid INT(20) NOT NULL,
        questionid VARCHAR(100) NOT NULL,
        answer VARCHAR(200) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(answerid),
        FOREIGN KEY(userid) REFERENCES users(userid) ON DELETE CASCADE,
        FOREIGN KEY(questionid) REFERENCES questions(questionid) ON DELETE CASCADE
      );
    `);

    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error.message);
    process.exit(1); // Exit process on error
  }
};

// Initialize the database
createTables();

// Export the database connection
module.exports = db;
