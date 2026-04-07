import "dotenv/config";
import { createDeepAgent } from "deepagents";
import { ChatOllama } from "@langchain/ollama";
import webSearch from "../../tools/tavily-web-search";

async function invokeAgent(message: string): Promise<string> {
  const ollamaModel = new ChatOllama({
    model: "kimi-k2.5:cloud",
  });

  const agent = createDeepAgent({
    model: ollamaModel,
    tools: [webSearch],
    systemPrompt: "You are a research agent",
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

    console.log("RESULT:", result);

    if (result && typeof result === "object" && "messages" in result) {
      const messages = result.messages as Array<{ content?: string }>;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.content) {
        return lastMessage.content;
      }
    }

    return JSON.stringify(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Agent invocation failed: ${errorMessage}`);
  }
}

export default invokeAgent;
