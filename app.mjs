import "dotenv/config";               // ใช้ได้ตอน local (มี .env)
import express from "express";
import questionRouter from "./app/questionRouter.mjs";
import answerRouter from "./app/answerRouter.mjs";
import voteRouter from "./app/voteRouter.mjs";
import scoreRouter from "./app/scoreRouter.mjs";
import { mountSwagger } from "./app/swagger.mjs";

const app = express();
const port = 4000;

app.use(express.json());
mountSwagger(app);

app.get("/test", (_req, res) => res.json("Server API is working 🚀"));

app.use("/questions", questionRouter);
app.use("/questions", answerRouter);
app.use("/", voteRouter);
app.use("/", scoreRouter);

// ฟังพอร์ตเฉพาะตอนรันในเครื่อง
if (process.env.VERCEL !== "1") {
  app.listen(port, () => console.log(`Server is running at ${port}`));
}

export default app;
