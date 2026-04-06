import { createDeepAgent } from "deepagents";

async function invokeAgent(message: string) {
  const agent = createDeepAgent({
    model: "openrouter:google/gemini-3-flash-preview",
    systemPrompt:
      "You are a fun agent who responds like Michael Scott from Office",
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  return result;
}

export default invokeAgent;
