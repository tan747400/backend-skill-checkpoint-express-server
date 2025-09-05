import connectionPool from "../utils/db.mjs"; // ใช้สำหรับ query DB

// Middleware ตรวจสอบว่ามี answerId จริงหรือไม่
// ถ้าไม่พบ → return 404 ทันที
// ถ้าพบ → ให้ไป handler ต่อไป
async function answerExists(req, res, next) {
  const answer = Number(req.params.answerId); // แปลง answerId จาก URL เป็นตัวเลข

  // ถ้าไม่ใช่ตัวเลข → 400 Bad Request
  if (!Number.isInteger(answer)) {
    return res.status(400).json({ message: "Invalid answer id." });
  }

  // Query เพื่อตรวจสอบว่ามี answer_id นี้ใน DB หรือไม่
  const result = await connectionPool.query("SELECT 1 FROM answers WHERE id = $1", [answer]);

  // ถ้าไม่เจอ → 404 Not Found
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Answer not found." });
  }

  next();
}

export default answerExists;
