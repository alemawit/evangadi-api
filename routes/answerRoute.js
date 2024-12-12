// Answer routes
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { postAnswer, getAnswer } = require("../controller/answerController");
const router = express.Router();

// Route to post an answer
router.post("/", authMiddleware, postAnswer);

// Route to get answers for a specific question
router.get("/:questionid", authMiddleware, getAnswer);

module.exports = router;