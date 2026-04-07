"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deep_agent_1 = __importDefault(require("../../controller/deep-agent/deep-agent"));
const router = (0, express_1.Router)();
router.post("/deep-agent", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
    }
    try {
        const response = await (0, deep_agent_1.default)(message);
        res.json({ response });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: errorMessage });
    }
});
exports.default = router;
