// user routes
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { register, login, checkUser,logout } = require("../controller/userController");
//register route
router.post("/register", register);
//login user
router.post("/login", login);
//check user
router.get("/check", authMiddleware, checkUser);
//user logout
router.get("/logout", authMiddleware, logout);
module.exports = router;