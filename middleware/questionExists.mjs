import connectionPool from "../utils/db.mjs"; // ใช้สำหรับ query DB

// Middleware ตรวจสอบว่ามี questionId จริงหรือไม่
// ถ้าไม่พบ → return 404 ทันที
// ถ้าพบ → ให้ไป handler ต่อไป
async function questionExists(req, res, next) {
  const question = Number(req.params.questionId); // แปลง questionId จาก URL เป็นตัวเลข

  // ถ้าไม่ใช่ตัวเลข → 400 Bad Request
  if (!Number.isInteger(question)) {
    return res.status(400).json({ message: "Invalid question id." });
  }

  // Query เพื่อตรวจสอบว่ามี question_id นี้ใน DB หรือไม่
  const result = await connectionPool.query("SELECT 1 FROM questions WHERE id = $1", [question]);

  // ถ้าไม่เจอ → 404 Not Found
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Question not found." });
  }

  next();
}

export default questionExists;
