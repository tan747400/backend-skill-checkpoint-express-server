import { Router } from "express";

import connectionPool from "../utils/db.mjs";


import questionValidationCreate from "../middleware/questionValidationCreate.mjs";
import questionValidationUpdate from "../middleware/questionValidationUpdate.mjs";
import questionSearchValidation from "../middleware/questionValidationSearch.mjs";

const questionRouter = Router();

/**
 * @openapi
 * /questions:
 *   post:
 *     summary: Create a new question
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "What is JavaScript?"
 *               description:
 *                 type: string
 *                 example: "Explain JavaScript basics"
 *               category:
 *                 type: string
 *                 example: "Programming"
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Unable to create question
 */
/** CREATE QUESTION */
questionRouter.post("/",  questionValidationCreate, async (req, res) => {
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
        id: result.rows[0].id, 
      });
    } catch (error) {
      console.error("Error in POST /questions:", error.message);
      return res.status(500).json({
        message: "Unable to create question.",
        error: error.message,
      });
    }
  });

/**
 * @openapi
 * /questions/search:
 *   get:
 *     summary: Search questions by title or category
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title of the question
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category of the question
 *     responses:
 *       200:
 *         description: List of questions
 *       500:
 *         description: Unable to fetch questions
 */ 
  /** SEARCH QUESTION */
  /** localhost:4000/questions/search?title=search&category=music วิธีcheck */
  /** localhost:4000/questions/search?title=What%20is%20JavaScript%3F&category=Programming วิธีcheck */
  questionRouter.get("/search", questionSearchValidation, async (req, res) => {
    try {
      const { title, category } = req.query;
  
      const where = [];
      const params = [];
      let i = 1;
  
      if (title) {
        where.push(`title ILIKE $${i++}`);
        params.push(`%${title}%`);
      }
  
      if (category) {
        where.push(`category ILIKE $${i++}`);
        params.push(`%${category}%`);
      }
  
      // ถ้ามีทั้ง title และ category ให้เชื่อมด้วย OR แทน AND
      const condition = where.length > 1 ? where.join(" OR ") : where.join("");
  
      const sql = `
        SELECT id, title, description, category
        FROM questions
        ${condition ? `WHERE ${condition}` : ""}
        ORDER BY id DESC
      `;
  
      const result = await connectionPool.query(sql, params);
      return res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error("Error in GET /questions/search:", error.message);
      return res.status(500).json({
        message: "Unable to fetch a question.",
        error: error.message,
      });
    }
  });

/**
 * @openapi
 * /questions:
 *   get:
 *     summary: Get all questions
 *     tags:
 *       - Questions
 *     responses:
 *       200:
 *         description: List of all questions
 *       500:
 *         description: Unable to fetch questions
 */
  /** READ ALL */
  questionRouter.get("/", async (req, res) => {
    try {
      const results = await connectionPool.query(`SELECT * FROM questions`);
      return res.status(200).json({ data: results.rows });
    } catch (error) {
      console.error("Error in GET /questions:", error.message);
      return res.status(500).json({
        message: "Unable to fetch questions.",
        error: error.message,
      });
    }
  });

/**
 * @openapi
 * /questions/{questionId}:
 *   get:
 *     summary: Get a question by ID
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to fetch question
 */   
  /** READ ONE */
  questionRouter.get("/:questionId", async (req, res) => {
    try {
      const questionIdFromUser = Number(req.params.questionId);
      const results = await connectionPool.query(
        `SELECT * FROM questions WHERE id = $1`,
        [questionIdFromUser]
      );
  
      if (!results.rows[0]) {
        return res
          .status(404)
          .json({ message: "Question not found." });
      }
  
      return res.status(200).json({ data: results.rows[0] });
    } catch (error) {
      console.error("Error in GET /questions/:questionId:", error.message);
      return res.status(500).json({
        message: "Unable to fetch questions.",
        error: error.message,
      });
    }
  });
  
/**
 * @openapi
 * /questions/{questionId}:
 *   put:
 *     summary: Update title or description of a question
 *     tags:
 *       - Questions
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated title"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to update question
 */
  /** UPDATE */
  /** เราไม่เขียนcategoryใน app.putนี้ เพราะจากโจทย์บอกว่า 
   * ผู้ใช้งานสามารถที่จะแก้ไขหัวข้อ หรือคำอธิบายของคำถามได้
   * ไม่ได้บอกว่าผู้ใช้งานสามารถเปลี่ยนแปลง category ได้
   * ซึ่งเราจะไปเขียนดักไว้ในกรณีที่ผู้ใช้งานป้อนข้อมูลว่าต้องการเปลี่ยนแปลงcategory
   * ที่middlewareอีกที
  */
  questionRouter.put("/:questionId", questionValidationUpdate, async (req, res) => {
    try {
      const questionId = Number(req.params.questionId);
      const { title, description } = req.body; 
  
      const result = await connectionPool.query(
        `UPDATE questions
         SET title = COALESCE($2, title),
             description = COALESCE($3, description)
         WHERE id = $1`,
        [questionId, title, description]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Question not found." });
      }
  
      return res.status(200).json({ message: "Question updated successfully." });
    } catch (error) {
      console.error("Error in PUT /questions/:questionId:", error.message);
      return res.status(500).json({ message: "Unable to fetch questions." });
    }
  });
  
/**
 * @openapi
 * /questions/{questionId}:
 *   delete:
 *     summary: Delete a question by ID
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to delete question
 */ 
  /** DELETE QUESTION */
  questionRouter.delete("/:questionId", async (req, res) => {
    try {
      const questionIdFromUser = Number(req.params.questionId);
      const result = await connectionPool.query(
        `DELETE FROM questions WHERE id = $1`,
        [questionIdFromUser]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Question not found." });
      }
  
      return res.status(200).json({ message: "Question post has been deleted successfully." });
    } catch (error) {
      console.error("Error in DELETE /questions/:questionId:", error.message);
      return res.status(500).json({
        message: "Unable to delete question.",
        error: error.message,
      });
    }
  });

export default questionRouter; 