import "dotenv/config";
import { createDeepAgent } from "deepagents";
import { ChatOllama } from "@langchain/ollama";
import { research_subagent } from "../../subagents/research-subagent/research-subagent";

async function invokeAgent(message: string): Promise<string> {
  const ollamaModel = new ChatOllama({
    model: "gemma4:31b-cloud",
  });

  const agent = createDeepAgent({
    model: ollamaModel,
    subagents: [research_subagent],
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
