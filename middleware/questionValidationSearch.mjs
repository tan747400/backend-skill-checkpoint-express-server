function questionSearchValidation(req, res, next) {
    const { title, category } = req.query || {};
  
    const titleValid = typeof title === "string" && title.trim() !== "";
    const categoryValid = typeof category === "string" && category.trim() !== "";
  
    if (!titleValid && !categoryValid) {
      return res.status(400).json({ message: "Invalid search parameters." });
    }
  
    if (titleValid) req.query.title = title.trim();
    if (categoryValid) req.query.category = category.trim();
  
    next();
  }
  
  export default questionSearchValidation;
  