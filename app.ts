import express, { Request, Response, Application } from "express";

const app: Application = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express!");
});

import deepagentRoute from "./routes/deep-agent/deep-agent";
app.use("/agent", deepagentRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
