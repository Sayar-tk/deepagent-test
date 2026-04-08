import "dotenv/config";
import { createDeepAgent } from "deepagents";
import { ChatOllama } from "@langchain/ollama";
import { research_subagent } from "../../subagents/research-subagent/research-subagent";
import { FilesystemBackend } from "deepagents";
import { MemorySaver } from "@langchain/langgraph";
import { traceable } from "langsmith/traceable";

const DEFAULT_THREAD_ID = "thread-default";
const checkpointer = new MemorySaver();
const ollamaModel = new ChatOllama({
  model: "gemma4:31b-cloud",
});
const backend = new FilesystemBackend({
  rootDir: process.cwd(),
  virtualMode: true,
});
const agent = createDeepAgent({
  model: ollamaModel,
  subagents: [research_subagent],
  backend,
  checkpointer,
});

async function invokeAgent(message: string, threadId?: string): Promise<string> {
  const resolvedThreadId =
    typeof threadId === "string" && threadId.trim().length > 0
      ? threadId.trim()
      : DEFAULT_THREAD_ID;

  const config = {
    configurable: {
      thread_id: resolvedThreadId,
    },
  };

  try {
    const result = await agent.invoke(
      {
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      },
      config,
    );

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

const tracedInvokeAgent = traceable(invokeAgent, {
  name: "deep-agent-invoke",
  run_type: "chain",
  project_name: process.env.LANGSMITH_PROJECT || "default",
});

export default tracedInvokeAgent;
