function ValidationQuestionData(req, res, next) {
    const { title, description, category } = req.body || {};
  
    // --- 1) เช็คว่ามีค่าครบทั้ง 3 อันไหม ---
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Invalid request data." });
    }
  
    // --- 2) เช็คว่าทุกค่าเป็น string และไม่ใช่ค่าว่าง ---
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ message: "Invalid request data." });
    }
    if (typeof description !== "string" || description.trim() === "") {
      return res.status(400).json({ message: "Invalid request data." });
    }
    if (typeof category !== "string" || category.trim() === "") {
      return res.status(400).json({ message: "Invalid request data." });
    }
    // --- 3) ถ้าผ่านหมด -> ทำความสะอาดข้อมูลก่อนส่งต่อ ---
    req.body.title = title.trim();
    req.body.description = description.trim();
    req.body.category = category.trim();
  
    // ส่งต่อไป route หลัก
    next();
  }
  
  export default ValidationQuestionData;
  