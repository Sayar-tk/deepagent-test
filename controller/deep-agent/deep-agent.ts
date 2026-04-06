import { createDeepAgent } from "deepagents";

async function invokeAgent(message: string): Promise<string> {
  const agent = createDeepAgent({
    model: "openrouter:google/gemini-3-flash-preview",
    systemPrompt:
      "You are a fun agent who responds like Michael Scott from Office",
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
