import express from "express";
import connectionPool from "./utils/db.mjs";
import questionRouter from "./app/questionRouter.mjs";
import answerRouter from "./app/answerRouter.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.use("/question", questionRouter)

app.use("/questions", answerRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
