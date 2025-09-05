function answerValidationCreate(req, res, next) {
    const { content } = req.body || {};
  
    // --- 1) เช็คว่ามีค่าไหม ---
    if (!content) {
      return res.status(400).json({ message: "Answer content is required." });
    }
  
    // --- 2) เช็คว่าเป็น string และไม่ใช่ค่าว่าง ---
    if (typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ message: "Answer content must be a non-empty string." });
    }
  
    const trimmedContent = content.trim();
  
    // --- 3) เช็คความยาวไม่เกิน 300 ตัวอักษร ---
    if (trimmedContent.length > 300) {
      return res.status(400).json({ message: "Answer content must not exceed 300 characters." });
    }
  
    // --- 4) ถ้าผ่านหมด -> เก็บกลับเข้า req.body.content ---
    req.body.content = trimmedContent;
  
    // ส่งต่อไป route หลัก
    next();
  }
  
  export default answerValidationCreate;
  