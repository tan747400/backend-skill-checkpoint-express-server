import express from "express";
import questionRouter from "./app/questionRouter.mjs";
import answerRouter from "./app/answerRouter.mjs";
import voteRouter from "./app/voteRouter.mjs";
import scoreRouter from "./app/scoreRouter.mjs";
import { mountSwagger } from "./app/swagger.mjs";

const app = express();
const port = 4000;

app.use(express.json());

// Swagger UI + JSON
mountSwagger(app);  // เปิด /docs และ /docs.json

app.get("/test", (_req, res) => res.json("Server API is working 🚀"));

app.use("/questions", questionRouter);
app.use("/questions", answerRouter);
app.use("/", voteRouter);
app.use("/", scoreRouter);

// ตอน deploy บน Vercel ไม่ต้อง app.listen()
// ใช้เฉพาะตอนรันเครื่องตัวเอง
if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

export default app; // ส่งออก app เพื่อใช้กับ Vercel
