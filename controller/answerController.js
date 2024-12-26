// const { StatusCodes } = require("http-status-codes");
// const dbConnection = require("../db/dbconfig");

// async function postAnswer(req, res) {
//   const { questionid, answer } = req.body;

//   // Validate that both questionid and answer are provided
//   if (!questionid || !answer) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       error: "Bad Request",
//       message: "Please provide all required fields",
//     });
//   }

//   try {
//     // Check if questionid exists
//     const [question] = await dbConnection.query(
//       "SELECT * FROM questions WHERE questionid = ?",
//       [questionid]
//     );

//     if (question.length === 0) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         message: "Question does not exist.",
//       });
//     }

//     // Insert the new answer into the database
//     const [result] = await dbConnection.query(
//       "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
//       [req.user.userid, questionid, answer]
//     );

//     // Log the result for debugging
//     console.log("Insert result:", result);

//     // Respond with success
//     return res.status(StatusCodes.CREATED).json({
//       message: "Answer posted successfully",
//     });
//   } catch (error) {
//     // Log the error details for debugging
//     console.error("Error details:", error.message);
//     console.error("Full error object:", error);

//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: "Internal Server Error",
//       message: "An unexpected error occurred.",
//     });
//   }
// }

// async function getAnswer(req, res) {
//   const questionid = req.params.questionid;

//   try {
//     // Fetch answers for the given questionid
//     const [rows] = await dbConnection.query(
//       `SELECT
//         q.answerid, q.answer, q.userid,
//         u.username, u.firstname, u.lastname
//       FROM answers AS q
//       JOIN users AS u ON q.userid = u.userid
//       WHERE q.questionid = ?`,
//       [questionid]
//     );

//     // If no answers are found, return a 404
//     if (rows.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         message: "No answers found for this question.",
//       });
//     }

//     // Return the answers
//     return res.status(StatusCodes.OK).json(rows);
//   } catch (error) {
//     console.error("Error details:", error.message);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: "Internal Server Error",
//       message: "An unexpected error occurred.",
//     });
//   }
// }

// // Update an answer (direct SQL query)
// async function updateAnswer(req, res) {
//   const { answerId } = req.params; // Answer ID from URL params
//   const { answer } = req.body; // New answer content

//   // Validate that answer is provided
//   if (!answer) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       error: "Bad Request",
//       message: "Please provide the updated answer",
//     });
//   }

//   try {
//     // Check if the answer exists
//     console.log("Attempting to update answer:", answerId, req.user.userid);
//     const [existingAnswer] = await dbConnection.query(
//       "SELECT * FROM answers WHERE answerid = ? AND userid = ?",
//       [answerId, req.user.userid] // Ensure only the owner can update the answer
//     );

//     if (existingAnswer.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         message: "Answer not found or you do not have permission to edit it.",
//       });
//     }

//     // Update the answer in the database
//     const [result] = await dbConnection.query(
//       "UPDATE answers SET answer = ? WHERE answerid = ? AND userid = ?",
//       [answer, answerId, req.user.userid]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         message: "Failed to update the answer.",
//       });
//     }

//     // Respond with success
//     return res.status(StatusCodes.OK).json({
//       message: "Answer updated successfully",
//     });
//   } catch (error) {
//     console.error("Error details:", error.message);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: "Internal Server Error",
//       message: "An unexpected error occurred.",
//     });
//   }
// }

// // Delete an answer
// async function deleteAnswer(req, res) {
//   const { answerId } = req.params; // Answer ID from URL params
//  console.log(answerId)
//   try {
//     // Check if the answer exists
//     const [existingAnswer] = await dbConnection.query(
//       "SELECT * FROM answers WHERE answerid = ? AND userid = ?",
//       [answerId, req.user.userid] // Ensure only the owner can delete the answer
//     );

//     if (existingAnswer.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         message: "Answer not found or you do not have permission to delete it.",
//       });
//     }

//     // Delete the answer from the database
//     const [result] = await dbConnection.query(
//       "DELETE FROM answers WHERE answerid = ? AND userid = ?",
//       [answerId, req.user.userid]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         message: "Failed to delete the answer.",
//       });
//     }

//     // Respond with success
//     return res.status(StatusCodes.OK).json({
//       message: "Answer deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error details:", error.message);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: "Internal Server Error",
//       message: "An unexpected error occurred.",
//     });
//   }
// }

// module.exports = { postAnswer, getAnswer, updateAnswer, deleteAnswer };

const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbconfig");

// Post an answer
async function postAnswer(req, res) {
  const { questionid, answer } = req.body;

  if (!questionid || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const [question] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (question.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Question does not exist.",
      });
    }

    const [result] = await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [req.user.userid, questionid, answer]
    );

    console.log("Insert result:", result);

    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (error) {
    console.error("Error details:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Get answers for a specific question
async function getAnswer(req, res) {
  const questionid = req.params.questionid;

  try {
    const [rows] = await dbConnection.query(
      `SELECT 
        q.answerid, q.answer, q.userid, 
        u.username, u.firstname, u.lastname 
      FROM answers AS q 
      JOIN users AS u ON q.userid = u.userid 
      WHERE q.questionid = ?`,
      [questionid]
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No answers found for this question.",
      });
    }

    return res.status(StatusCodes.OK).json(rows);
  } catch (error) {
    console.error("Error details:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Update an answer
async function updateAnswer(req, res) {
  const { answerid } = req.params;
  const { answer } = req.body;

  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide the updated answer",
    });
  }

  try {
    console.log("Attempting to update answer:", answerid, req.user.userid);
    const [existingAnswer] = await dbConnection.query(
      "SELECT * FROM answers WHERE answerid = ? AND userid = ?",
      [answerid, req.user.userid]
    );

    if (existingAnswer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found or you do not have permission to edit it.",
      });
    }

    const [result] = await dbConnection.query(
      "UPDATE answers SET answer = ? WHERE answerid = ? AND userid = ?",
      [answer, answerid, req.user.userid]
    );

    if (result.affectedRows === 0) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to update the answer.",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Answer updated successfully",
    });
  } catch (error) {
    console.error("Error details:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Delete an answer
async function deleteAnswer(req, res) {
  const { answerid } = req.params; // Answer ID from URL params
  const { userid } = req.user; // Get the user id from the session or token

  console.log(
    `Attempting to delete answer with ID: ${answerid} by user: ${userid}`
  );

  try {
    // Check if the answer exists and if the current user is the owner of the answer
    const [existingAnswer] = await dbConnection.query(
      "SELECT * FROM answers WHERE answerid = ? AND userid = ?",
      [answerid, userid]
    );

    if (existingAnswer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found or you do not have permission to delete it.",
      });
    }

    // Proceed with the deletion if the answer exists
    const [result] = await dbConnection.query(
      "DELETE FROM answers WHERE answerid = ? AND userid = ?",
      [answerid, userid]
    );

    if (result.affectedRows === 0) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to delete the answer.",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Answer deleted successfully",
    });
  } catch (error) {
    console.error("Error details:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { postAnswer, getAnswer, updateAnswer, deleteAnswer };
