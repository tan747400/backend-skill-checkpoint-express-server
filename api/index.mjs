// api/index.mjs
import app from "../app.mjs";  // นำเข้า Express app หลักจาก app.mjs

// Vercel จะใช้ default export เป็น serverless handler
export default app;