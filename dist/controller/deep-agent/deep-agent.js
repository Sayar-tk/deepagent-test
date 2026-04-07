"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const deepagents_1 = require("deepagents");
const ollama_1 = require("@langchain/ollama");
const research_subagent_1 = require("../../subagents/research-subagent/research-subagent");
const deepagents_2 = require("deepagents");
const langgraph_1 = require("@langchain/langgraph");
async function invokeAgent(message) {
    const ollamaModel = new ollama_1.ChatOllama({
        model: "gemma4:31b-cloud",
    });
    const config = {
        configurable: {
            thread_id: `thread-${Date.now()}`,
        },
    };
    const backend = new deepagents_2.FilesystemBackend({ rootDir: process.cwd() });
    const checkpointer = new langgraph_1.MemorySaver();
    const agent = (0, deepagents_1.createDeepAgent)({
        model: ollamaModel,
        subagents: [research_subagent_1.research_subagent],
        backend,
        checkpointer,
    });
    try {
        const result = await agent.invoke({
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        }, config);
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
