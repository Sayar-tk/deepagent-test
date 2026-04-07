"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.research_subagent = void 0;
const tavily_web_search_1 = __importDefault(require("../../tools/web-search/tavily-web-search"));
const deep_agent_system_prompt_1 = __importDefault(require("../../prompts/deep-agent-system-prompt/deep-agent-system-prompt"));
const log_tool_calls_1 = require("../../middleware/log-tool-calls/log-tool-calls");
exports.research_subagent = {
    name: "research-agent",
    description: "Researches topics with web search and returns concise findings.",
    tools: [tavily_web_search_1.default],
    systemPrompt: deep_agent_system_prompt_1.default,
    middleware: [log_tool_calls_1.logToolCallsMiddleware],
    model: "openai:gpt-5.2",
};
