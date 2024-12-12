// -- CREATE TABLE users (
// --     userid INT(20) NOT NULL AUTO_INCREMENT,
// --     username VARCHAR(20) NOT NULL UNIQUE,  -- Ensure username is unique
// --     firstname VARCHAR(20) NOT NULL,
// --     lastname VARCHAR(20) NOT NULL,
// --     email VARCHAR(40) NOT NULL UNIQUE,  -- Ensure email is unique
// --     password VARCHAR(100) NOT NULL,
// --     PRIMARY KEY(userid)
// -- );

// -- CREATE TABLE questions (
// --     id INT(20) NOT NULL AUTO_INCREMENT,
// --     questionid VARCHAR(100) NOT NULL UNIQUE,  -- Ensure questionid is unique
// --     userid INT(20) NOT NULL,  -- Foreign key to users
// --     title VARCHAR(50) NOT NULL,
// --     description VARCHAR(200) NOT NULL,
// --     tag VARCHAR(20),
// --     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// --     PRIMARY KEY(id ,questionid),
// --     FOREIGN KEY(userid) REFERENCES users(userid)  -- Establishes relationship with users table
// -- );

// -- CREATE TABLE answers (
// --     answerid INT(20) NOT NULL AUTO_INCREMENT,
// --     userid INT(20) NOT NULL,  -- Foreign key to users
// --     questionid VARCHAR(100) NOT NULL,  -- Foreign key to questions
// --     answer VARCHAR(200) NOT NULL,
// --     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// --     PRIMARY KEY(answerid),
// --     FOREIGN KEY(userid) REFERENCES users(userid),  -- Establishes relationship with users table
// --     FOREIGN KEY(questionid) REFERENCES questions(questionid)  -- Establishes relationship with questions table
// -- );
