import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import questionValidationVote from "../middleware/questionValidationVote.mjs";
import answerValidationVote from "../middleware/answerValidationVote.mjs";

const voteRouter = Router();

voteRouter.post("/questions/:questionId/vote", questionValidationVote, async (req, res) => {
  const questionId = Number(req.params.questionId);
  const vote = Number(req.body.vote);

  try {
    const result = await connectionPool.query("SELECT 1 FROM questions WHERE id = $1", [questionId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(
      "INSERT INTO question_votes (question_id, vote) VALUES ($1, $2)",
      [questionId, vote]
    );

    return res.status(200).json({ message: "Vote on the question has been recorded successfully." });
  } catch (err) {
    console.error("POST /questions/:questionId/vote error:", err);
    return res.status(500).json({ message: "Unable to vote question." });
  }
});

voteRouter.post("/answers/:answerId/vote", answerValidationVote, async (req, res) => {
  const answerId = Number(req.params.answerId);
  const vote = Number(req.body.vote);

  try {
    const result = await connectionPool.query("SELECT 1 FROM answers WHERE id = $1", [answerId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Answer not found." });
    }

    await connectionPool.query(
      "INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)",
      [answerId, vote]
    );

    return res.status(200).json({ message: "Vote on the answer has been recorded successfully." });
  } catch (err) {
    console.error("POST /answers/:answerId/vote error:", err);
    return res.status(500).json({ message: "Unable to vote answer." });
  }
});

export default voteRouter;
