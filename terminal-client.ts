import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = readline.createInterface({ input: stdin, output: stdout });
const API_URL = "http://localhost:3001/agent/deep-agent";
const THREAD_ID = `terminal-${Date.now()}`;

async function sendMessage(message: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, threadId: THREAD_ID }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}

async function main() {
  console.log("Deep Agent Terminal Client");
  console.log(`Thread ID: ${THREAD_ID}`);
  console.log("Type 'exit' or 'quit' to stop\n");

  while (true) {
    const input = await rl.question("you> ");

    if (!input || input.trim() === "") continue;

    const trimmed = input.trim().toLowerCase();
    if (trimmed === "exit" || trimmed === "quit") {
      console.log("Goodbye!");
      break;
    }

    try {
      process.stdout.write("agent> ");
      const response = await sendMessage(input);
      console.log(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.log(`Error: ${message}`);
    }
  }

  rl.close();
}

main();
