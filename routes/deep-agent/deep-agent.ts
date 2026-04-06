import { Router } from "express";
import invokeAgent from "../../controller/deep-agent/deep-agent";

const router = Router();

router.post("/agents", invokeAgent);

export default router;
