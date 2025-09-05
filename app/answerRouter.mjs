import { Router } from "express";

import connectionPool from "../utils/db.mjs";

import answerValidationCreate from "../middleware/answerValidationCreate.mjs";

const answerRouter = Router();

/**
 * @openapi
 * /questions/{questionId}/answers:
 *   post:
 *     summary: Create a new answer for a question
 *     tags:
 *       - Answers
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is an example answer."
 *     responses:
 *       201:
 *         description: Answer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 id: { type: integer }
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to create answer
 */
/** CREATE ANSWERS */
answerRouter.post("/:questionId/answers", answerValidationCreate, async (req, res) => {
    const questionId = Number(req.params.questionId);
    const content = req.body.content;
  
    try {
      const result = await connectionPool.query(
        `INSERT INTO answers (question_id, content)
         VALUES ($1, $2)
         RETURNING id`,
        [questionId, content]
      );
  
      return res.status(201).json({
        message: "Answer created successfully.",
        id: result.rows[0].id
      });
    } catch (error) {
      console.error("Error in POST /questions/:questionId/answers:", error.message);
      return res.status(500).json({
        message: "Unable to create answers.",
        error: error.message
      });
    }
  });
  
/**
 * @openapi
 * /questions/{questionId}/answers:
 *   get:
 *     summary: Get all answers for a question
 *     tags:
 *       - Answers
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       content: { type: string }
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to fetch answers
 */
  /** READ ONE ANSWER*/
answerRouter.get("/:questionId/answers", async (req, res) => {
    const questionId = Number(req.params.questionId);
  
    try {
      const questionCheck = await connectionPool.query(
        `SELECT id FROM questions WHERE id = $1`,
        [questionId]
      );
  
      if (questionCheck.rowCount === 0) {
        return res.status(404).json({ message: "Question not found." });
      }
      const result = await connectionPool.query(
        `SELECT id, content FROM answers WHERE question_id = $1 ORDER BY id ASC`,
        [questionId]
      );
  
      return res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error("Error in GET /questions/:questionId/answers:", error.message);
      return res.status(500).json({
        message: "Unable to fetch answers.",
        error: error.message,
      });
    }
  });

/**
 * @openapi
 * /questions/{questionId}/answers:
 *   delete:
 *     summary: Delete all answers for a question
 *     tags:
 *       - Answers
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All answers deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to delete answers
 */
  /**
   * DELETE /questions/:questionId/answers
   * 
   * โจทย์บอกว่า:
   * - ผู้ใช้งานสามารถลบคำถามได้
   * - เมื่อลบคำถามออก คำตอบก็จะถูกลบตามคำถามนั้นๆ ด้วย
   * 
   * แต่ API documentation กำหนด endpoint แยกกันชัดเจนว่า:
   * - DELETE /questions/:questionId -> ลบคำถาม
   * - DELETE /questions/:questionId/answers -> ลบคำตอบของคำถามนั้น
   * 
   * เนื่องจากคำอธิบายในโจทย์กับ API doc ไม่สอดคล้องกัน
   * จึงผมตัดสินใจทำตาม API doc เพราะเป็นมาตรฐานที่ควรปฏิบัติตาม
   * 
   * โดย endpoint นี้จะลบเฉพาะคำตอบของคำถามที่ระบุ ไม่ได้ลบคำถามเอง
   */
answerRouter.delete("/questions/:questionId/answers", async (req, res) => {
    try {
      const questionId = Number(req.params.questionId);
  
      const questionResult = await connectionPool.query(
        `SELECT id FROM questions WHERE id = $1`,
        [questionId]
      );
  
      if (questionResult.rowCount === 0) {
        return res.status(404).json({ message: "Question not found." });
      }
  
  
      await connectionPool.query(
        `DELETE FROM answers WHERE question_id = $1`,
        [questionId]
      );
  
      return res.status(200).json({
        message: "All answers for the question have been deleted successfully."
      });
    } catch (error) {
      console.error("Error in DELETE /questions/:questionId/answers:", error.message);
      return res.status(500).json({
        message: "Unable to delete answers.",
        error: error.message,
      });
    }
  });

  export default answerRouter;