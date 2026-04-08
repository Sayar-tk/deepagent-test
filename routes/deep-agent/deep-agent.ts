import { Router, Request, Response } from "express";
import invokeAgent from "../../controller/deep-agent/deep-agent";

const router = Router();

router.post("/deep-agent", async (req: Request, res: Response) => {
  const { message, threadId } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  if (threadId !== undefined && typeof threadId !== "string") {
    res.status(400).json({ error: "threadId must be a string" });
    return;
  }

  try {
    const response = await invokeAgent(message, threadId);
    res.json({ response, threadId: threadId ?? "thread-default" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
