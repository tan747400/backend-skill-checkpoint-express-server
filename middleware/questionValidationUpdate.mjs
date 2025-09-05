function questionValidationUpdate(req, res, next) {
    const { title, description, category } = req.body || {};
  
    // 1) ห้ามส่ง category
    if (typeof category !== "undefined") {
      return res.status(400).json({ message: "Invalid request data." });
    }
  
    // 2) ต้องมีอย่างน้อย title หรือ description undefined แปลว่า ไม่มีใส่ข้อมูลเข้ามา
    //มันต้องทั้งundefineทั้งสองค่า ถึงจะ return status 400
    //อันนี้คือใส่ "" ก็ผ่าน แต่กรณีไม่ผ่านคือไม่ได้ใส่อะไรมาเลย
    if (typeof title === "undefined" && typeof description === "undefined") {
      return res.status(400).json({ message: "Invalid request data." });
    }
  
    // 3) ถ้ามี title ต้องเป็น string และไม่ว่าง
    //มีค่ามาแต่มาแต่ว่างเช่น "", "  " ก็จะมาตายในขั้นตอนนี้
    if (typeof title !== "undefined") {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ message: "Invalid request data." });
      }
      req.body.title = title.trim();
    }
  
    // 4) ถ้ามี description ต้องเป็น string และไม่ว่าง
     //มีค่ามาแต่มาแต่ว่างเช่น "", "  " ก็จะมาตายในขั้นตอนนี้
    if (typeof description !== "undefined") {
      if (typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({ message: "Invalid request data." });
      }
      req.body.description = description.trim();
    }
  
    // 5) แปลง undefined → null สำหรับ COALESCE ใน SQL
    if (typeof title === "undefined") req.body.title = null;
    if (typeof description === "undefined") req.body.description = null;
  
    next();
  }

  export default questionValidationUpdate;