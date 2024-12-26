// Answer routes
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { postAnswer, getAnswer,updateAnswer,
  deleteAnswer,
} = require("../controller/answerController");
const router = express.Router();

// Route to post an answer
router.post("/", authMiddleware, postAnswer);

// Route to get answers for a specific question
router.get("/:questionid", authMiddleware, getAnswer);
// Route to update an existing answer
router.put("/:answerid", authMiddleware, updateAnswer);

// Route to delete an answer
router.delete("/:answerid", authMiddleware, deleteAnswer);


module.exports = router;