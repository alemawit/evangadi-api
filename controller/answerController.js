// answer controller
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbconfig");

async function postAnswer(req, res) {
  const { questionid, answer } = req.body;

  // Validate that both questionid and answer are provided
  if (!questionid || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Check if questionid exists
    const [question] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (question.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Question does not exist.",
      });
    }

    // Insert the new answer into the database
    const [result] = await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [req.user.userid, questionid, answer]
    );

    // Log the result for debugging
    console.log("Insert result:", result);

    // Respond with success
    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (error) {
    // Log the error details for debugging
    console.error("Error details:", error.message);
    console.error("Full error object:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function getAnswer(req, res) {
  const questionid = req.params.questionid;

  try {
    // Fetch answers for the given questionid
    const [rows] = await dbConnection.query(
      `SELECT 
        q.answerid, q.answer, q.userid, 
        u.username, u.firstname, u.lastname 
      FROM answers AS q 
      JOIN users AS u ON q.userid = u.userid 
      WHERE q.questionid = ?`,
      [questionid]
    );

    // If no answers are found, return a 404
    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No answers found for this question.",
      });
    }

    // Return the answers
    return res.status(StatusCodes.OK).json(rows);
  } catch (error) {
    console.error("Error details:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { postAnswer, getAnswer };