import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import questionExists from "../middleware/questionExists.mjs";
import answerExists from "../middleware/answerExists.mjs";

const scoreRouter = Router();

/**
 * @openapi
 * /questions/{questionId}/score:
 *   get:
 *     summary: Get score summary for a question
 *     tags:
 *       - Scores
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Score summary for the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plus:
 *                   type: integer
 *                   example: 3
 *                 minus:
 *                   type: integer
 *                   example: 1
 *                 score:
 *                   type: integer
 *                   example: 2
 *       404:
 *         description: Question not found.
 *       500:
 *         description: Unable to get question score.
 */
/**
 * GET /questions/:questionId/score
 * คืนค่าผลรวมโหวตของ questionId ที่ส่งมา
 * response: { plus: จำนวนโหวต +1, minus: จำนวนโหวต -1, score: บวก-ลบ }
 */
scoreRouter.get("/questions/:questionId/score", questionExists, async (req, res) => {
  const question = Number(req.params.questionId); // แปลง questionId จาก URL เป็นตัวเลข

  // Query รวมคะแนน แยกบวก/ลบ และผลรวม
  const { rows } = await connectionPool.query(
    `
    SELECT
      COUNT(*) FILTER (WHERE vote::int = 1)  AS plus,   -- จำนวนโหวต +1
      COUNT(*) FILTER (WHERE vote::int = -1) AS minus,  -- จำนวนโหวต -1
      COALESCE(SUM(vote::int), 0)            AS score   -- ผลรวม (บวก-ลบ)
    FROM question_votes
    WHERE question_id = $1
    `,
    [question]
  );

  // ดึงค่าจาก query result
  const { plus, minus, score } = rows[0];

  // ส่งผลลัพธ์เป็น JSON
  return res.status(200).json({
    plus: Number(plus),
    minus: Number(minus),
    score: Number(score),
  });
});

/**
 * @openapi
 * /answers/{answerId}/score:
 *   get:
 *     summary: Get score summary for an answer
 *     tags:
 *       - Scores
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Score summary for the answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plus:
 *                   type: integer
 *                   example: 2
 *                 minus:
 *                   type: integer
 *                   example: 0
 *                 score:
 *                   type: integer
 *                   example: 2
 *       404:
 *         description: Answer not found.
 *       500:
 *         description: Unable to get answer score.
 */
/**
 * GET /answers/:answerId/score
 * คืนค่าผลรวมโหวตของ answerId ที่ส่งมา
 * response: { plus: จำนวนโหวต +1, minus: จำนวนโหวต -1, score: บวก-ลบ }
 */
scoreRouter.get("/answers/:answerId/score", answerExists, async (req, res) => {
  const answer = Number(req.params.answerId); // แปลง answerId จาก URL เป็นตัวเลข

  // Query รวมคะแนน แยกบวก/ลบ และผลรวม
  const { rows } = await connectionPool.query(
    `
    SELECT
      COUNT(*) FILTER (WHERE vote::int = 1)  AS plus,   -- จำนวนโหวต +1
      COUNT(*) FILTER (WHERE vote::int = -1) AS minus,  -- จำนวนโหวต -1
      COALESCE(SUM(vote::int), 0)            AS score   -- ผลรวม (บวก-ลบ)
    FROM answer_votes
    WHERE answer_id = $1
    `,
    [answer]
  );

  // ดึงค่าจาก query result
  const { plus, minus, score } = rows[0];

  // ส่งผลลัพธ์เป็น JSON
  return res.status(200).json({
    plus: Number(plus),
    minus: Number(minus),
    score: Number(score),
  });
});

export default scoreRouter;