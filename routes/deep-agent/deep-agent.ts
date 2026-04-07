import { Router, Request, Response } from "express";
import invokeAgent from "../../controller/deep-agent/deep-agent";

const router = Router();

router.post("/agents", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const response = await invokeAgent(message);
    res.json({ response });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
