// question controller
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbconfig");
const crypto = require("crypto");
const keywordExtractor = require("keyword-extractor");

// Function to generate a unique alphanumeric string
function generateUniqueId() {
  return crypto.randomBytes(16).toString("hex");
}


      async function postQuestion(req, res) {
        const { title, description, tag } = req.body;
        const userid = req.user?.userid; // Extract userid from middleware (authMiddleware)

        // Check for missing fields
        if (!title || !description) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Please provide all required fields",
          });
        }

        const questionid = generateUniqueId();

        // Extract keywords from title or description
        let extractedTags = [];
        if (!tag) {
          const extractedFromTitle = keywordExtractor.extract(title, {
            language: "english",
            remove_digits: true,
            return_changed_case: true,
            remove_duplicates: true,
          });

          const extractedFromDescription = keywordExtractor.extract(
            description,
            {
              language: "english",
              remove_digits: true,
              return_changed_case: true,
              remove_duplicates: true,
            }
          );

          // Combine extracted keywords and pick the top 3 as tags
          extractedTags = [
            ...new Set([...extractedFromTitle, ...extractedFromDescription]),
          ].slice(0, 3);
        }

        
        const finalTag =
          tag ||
          (extractedTags.length
            ? extractedTags.join(", ")
            : "general");

        try {
          // Insert the new question into the database
          await dbConnection.query(
            c
          );

          return res.status(StatusCodes.CREATED).json({
            message: "Question posted successfully",
            questionid, // Return the created question ID
            tags: finalTag,
          });
        } catch (error) {
          console.error("Error details:", error.message);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong. Please try again later.",
          });
        }
      }


// Get All Questions


async function allQuestion(req, res) {
  try {
    // Fetch all questions with user details from the database
    const [questionsRow] = await dbConnection.query(
      `SELECT 
        q.questionid, q.title, q.description, q.userid, q.created_at, 
        u.username, u.firstname, u.lastname,
        (SELECT COUNT(*) FROM answers WHERE answers.questionid = q.questionid) AS total_answers
      FROM questions AS q 
      JOIN users AS u ON q.userid = u.userid`
    );

    // Check if any questions are available
    if (questionsRow.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found." });
    }

    return res.status(StatusCodes.OK).json(questionsRow);
  } catch (error) {
    console.error("Error details:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}


// Get a Single Question
async function singleQuestion(req, res) {
  const { questionid } = req.params; // Use path parameter instead of body

  try {
    const [questions] = await dbConnection.query(
      `SELECT 
        q.questionid, q.title, q.description AS content, 
        u.username 
      FROM questions AS q 
      JOIN users AS u ON q.userid = u.userid 
      WHERE q.questionid = ?`,
      [questionid]
    );

    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "The requested question could not be found.",
      });
    }

    return res.status(StatusCodes.OK).json(questions[0]); // Return the first matching question
  } catch (error) {
    console.error("Error details:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong. Please try again later.",
    });
  }
}

module.exports = { postQuestion, allQuestion, singleQuestion };