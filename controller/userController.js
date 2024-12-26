// user controller
const dbConnection = require("../db/dbconfig");
const bcrypt = require("bcrypt");
const { StatusCodes, getStatusCode } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  console.log("Received request body:", req.body);

  // Check for required fields
  if (!username || !password || !firstname || !lastname || !email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    // Check if user or email already exists
    const [user] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username=? OR email=?",
      [username, email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already exists" });
    }

    // Validate password length
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters long" });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    await dbConnection.query(
      "INSERT INTO users(username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again later" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const [user] = await dbConnection.query(
      "SELECT username,userid,password FROM users WHERE email=?",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "user logged in successfully", token, username });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, please try again later" });
  }
}
async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  return res
    .status(StatusCodes.OK)
    .json({ msg: "valid user", username, userid });
}
async function logout(req, res) {
  return res.status(200).json({ msg: "Successfully logged out" });
}


module.exports = { register, login, checkUser, logout};