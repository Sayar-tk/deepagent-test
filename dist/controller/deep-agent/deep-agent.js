"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const deepagents_1 = require("deepagents");
const ollama_1 = require("@langchain/ollama");
const research_subagent_1 = require("../../subagents/research-subagent/research-subagent");
async function invokeAgent(message) {
    const ollamaModel = new ollama_1.ChatOllama({
        model: "gemma4:31b-cloud",
    });
    const agent = (0, deepagents_1.createDeepAgent)({
        model: ollamaModel,
        subagents: [research_subagent_1.research_subagent],
    });
    try {
        const result = await agent.invoke({
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        });
        if (result && typeof result === "object" && "messages" in result) {
            const messages = result.messages;
            const lastMessage = messages[messages.length - 1];
            if (lastMessage?.content) {
                return lastMessage.content;
            }
        }
        return JSON.stringify(result);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Agent invocation failed: ${errorMessage}`);
    }
}
exports.default = invokeAgent;
