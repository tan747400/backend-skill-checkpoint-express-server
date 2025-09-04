import express from "express";
import connectionPool from "./utils/db.mjs";
import ValidationQuestionData from "./middleware/questionValidation.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

/** CREATE QUESTION */
app.post("/questions",  ValidationQuestionData, async (req, res) => {
  const newQuestion = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category
  };

  try {
    const result = await connectionPool.query(
      `INSERT INTO questions (title, description, category)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [newQuestion.title, newQuestion.description, newQuestion.category]
    );

    return res.status(201).json({
      message: "Question created successfully.",
      id: result.rows[0].id, // DB สร้างให้เอง
    });
  } catch (error) {
    console.error("Error in POST /questions:", error.message);
    return res.status(500).json({
      message: "Unable to create question.",
      error: error.message,
    });
  }
});

/** READ ALL */
app.get("/questions", async (req, res) => {
  try {
    const results = await connectionPool.query(`SELECT * FROM questions`);
    return res.status(200).json({ data: results.ro
      ws });
  } catch (error) {
    console.error("Error in GET /questions:", error.message);
    return res.status(500).json({
      message: "Unable to fetch questions.",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
