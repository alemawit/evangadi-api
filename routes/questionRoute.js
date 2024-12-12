// question routes
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
// Question controllers
const {
  postQuestion,
  allQuestion,
  singleQuestion,
} = require("../controller/questionController");
// Post a new question
router.post("", authMiddleware, postQuestion);
// Get all questions
router.get("", authMiddleware, allQuestion);
// Get a single question by ID
router.get("/:questionid", authMiddleware, singleQuestion);
module.exports = router;