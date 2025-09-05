// // ตรวจสอบพารามิเตอร์และ body สำหรับการโหวต "คำตอบ"
function answerValidationVote(req, res, next) {
  const answerId = Number(req.params.answerId); //บอกว่าโหวตคำตอบไหน
  const vote = Number(req.body?.vote);

// ตรวจสอบรูปแบบ input ว่าเป็น 1 หรือ -1 ไหม
  if (!Number.isInteger(answerId) || ![1, -1].includes(vote)) {
    return res.status(400).json({ message: "Invalid vote value." });
  }

  next();
}

export default answerValidationVote;