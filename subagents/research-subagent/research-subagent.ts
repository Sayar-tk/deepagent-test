import webSearch from "../../tools/web-search/tavily-web-search";
import deepAgentSystemPrompt from "../../prompts/deep-agent-system-prompt/deep-agent-system-prompt";
import { logToolCallsMiddleware } from "../../middleware/log-tool-calls/log-tool-calls";
import type { SubAgent } from "deepagents";
import { ChatOllama } from "@langchain/ollama";

const ollamaModel = new ChatOllama({
  model: "gemma4:31b-cloud",
});

export const research_subagent: SubAgent = {
  name: "research-agent",
  description:
    "Researches topics with web search and returns concise findings.",
  tools: [webSearch],
  systemPrompt: deepAgentSystemPrompt,
  middleware: [logToolCallsMiddleware],
  skills: ["/skills/research-skills/"],
  model: ollamaModel,
};
