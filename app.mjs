import express from "express";
import connectionPool from "./utils/db.mjs";
import questionRouter from "./app/questionRouter.mjs";
import answerRouter from "./app/answerRouter.mjs";
import voteRouter from "./app/voteRouter.mjs";
import scoreRouter from "./app/scoreRouter.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.use("/questions", questionRouter)

app.use("/questions", answerRouter);

app.use("/", voteRouter);

app.use("/", scoreRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
