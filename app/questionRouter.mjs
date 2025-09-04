import { Router } from "express";

import connectionPool from "../utils/db.mjs";


import questionValidationCreate from "../middleware/questionValidationCreate.mjs";
import questionValidationUpdate from "../middleware/questionValidationUpdate.mjs";
import questionSearchValidation from "../middleware/questionValidationSearch.mjs";

const questionRouter = Router();

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