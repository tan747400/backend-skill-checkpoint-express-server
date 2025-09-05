// // ตรวจสอบพารามิเตอร์และ body สำหรับการโหวต "คำถาม"
function questionValidationVote(req, res, next) {
  const questionId = Number(req.params.questionId); //บอกว่าโหวตคำถามไหน
  const vote = Number(req.body?.vote);

// ตรวจสอบรูปแบบ input ว่าเป็น 1 หรือ -1 ไหม
  if (!Number.isInteger(questionId) || ![1, -1].includes(vote)) {
    return res.status(400).json({ message: "Invalid vote value." });
  }

  next();
}
export default questionValidationVote;