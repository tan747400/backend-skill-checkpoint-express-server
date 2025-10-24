import "dotenv/config";
import express from "express";

import questionRouter from "./app/questionRouter.mjs";
import answerRouter from "./app/answerRouter.mjs";
import voteRouter from "./app/voteRouter.mjs";
import scoreRouter from "./app/scoreRouter.mjs";
import { mountSwagger } from "./app/swagger.mjs";

const app = express();
const port = 4000;

app.use(express.json());

// Swagger docs (/docs, /docs.json)
mountSwagger(app);

// simple healthcheck
app.get("/test", (_req, res) => {
  res.json("Server API is working 🚀");
});

// routes
app.use("/questions", questionRouter);
app.use("/questions", answerRouter);
app.use("/", voteRouter);
app.use("/", scoreRouter);

// local only, don't listen on Vercel
if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

export default app;