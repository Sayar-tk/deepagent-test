# LangChain DeepAgents Starter Template

A foundational TypeScript template for building AI agents with LangChain. Clone it, customize it, deploy it your way.

## Features

- **Modular Agent Architecture** — Tools, subagents, skills, and middleware are organized as standalone modules
- **Terminal Interface** — Run your agent interactively from the command line
- **REST API** — Expose your agent as an HTTP backend
- **File-Based Persistence** — Simple backend storage for agent state and tool results
- **Extensible** — Drop in new tools, skills, or subagents without touching core logic

## Tech Stack

- [LangChain](https://python.langchain.com/) + [LangGraph](https://langchain-ai.github.io/langgraph/)
- [Ollama](https://ollama.com/) for local LLM inference (free, local, no API costs)
- Express.js REST API
- TypeScript

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Ollama](https://ollama.com/) installed locally with at least one model pulled

## Quick Start

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env .env.local
# Edit .env.local with your keys and Ollama model

# Run in terminal mode
npm run terminal

# Or run the API server
npm run dev
```

## Configuration

All configuration lives in `.env`. Key variables:

| Variable         | Description               | Default            |
| ---------------- | ------------------------- | ------------------ |
| `OLLAMA_API_KEY` | Ollama server URL         | -                  |
| `OLLAMA_MODEL`   | Model to use              | `gemma4:31b-cloud` |
| `TAVILY_API_KEY` | Tavily web search API key | —                  |
| `PORT`           | API server port           | `3000`             |

if you need langsmith tracing for LLM calls made by the application
| `LANGSMITH_API_KEY` | LangSmith api key (optional) | — |
| `LANGSMITH_TRACING` | LangSmith tracing (optional) | — true or false|
| `LANGSMITH_ENDPOINT`| LangSmith endpoint (optional)| —`https://api.smith.langchain.com` |
| `LANGSMITH_PROJECT` | LangSmith project (optional) | — |

### Using Different LLM Providers

This template ships with Ollama by default, but LangChain supports many providers. Edit `.env` and the agent initialization in `controller/deep-agent/deep-agent.ts`:

**Ollama (default — free, local)**

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

**OpenAI**

```env
OPENAI_API_KEY=sk-...
```

```typescript
// In controller, use ChatOpenAI instead of ChatOllama
import { ChatOpenAI } from "@langchain/openai";
const llm = new ChatOpenAI({ model: "gpt-4" });
```

**OpenRouter**

```env
OPENROUTER_API_KEY=...
```

```typescript
import { ChatOpenRouter } from "@langchain/openrouter";
const llm = new ChatOpenRouter({ model: "anthropic/claude-3-opus" });
```

## Project Structure

```
├── app.ts                    # Express server entry point
├── terminal-client.ts       # Terminal agent interface
├── controller/              # Request handlers and agent orchestration
│   └── deep-agent/
├── routes/                  # Express route definitions
│   └── deep-agent/
├── tools/                   # Reusable tools the agent can call
│   └── web-search/
├── skills/                  # Composed capabilities (use multiple tools)
├── subagents/               # Specialized agent subroutines
├── middleware/              # Request/response middleware
│   ├── log-tool-calls/
│   └── log-skill-usage/
├── prompts/                 # System prompts and prompt templates
├── web/                     # Frontend assets (optional)
├── large_tool_results/      # File-based storage for tool outputs
└── docs/                    # Documentation
```

### Key Files to Customize

| File                                                           | Purpose                                          |
| -------------------------------------------------------------- | ------------------------------------------------ |
| `prompts/deep-agent-system-prompt/deep-agent-system-prompt.ts` | Define your agent's personality and instructions |
| `controller/deep-agent/deep-agent.ts`                          | Agent initialization and core logic              |
| `tools/web-search/tavily-web-search.ts`                        | Add/edit tools the agent can use                 |
| `subagents/research-subagent/research-subagent.ts`             | Add specialized subagents                        |
| `skills/research-skills/arxiv-search/arxiv_search.ts`          | Add composed skill sets                          |

## API

### POST `/agent/deep-agent`

```bash
curl -X POST http://localhost:3000/agent/deep-agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Your question here", "threadId": "optional-thread-id"}'
```

**Response:**

```json
{
  "response": "Agent's reply...",
  "threadId": "thread-default"
}
```

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start Express server with hot reload |
| `npm run build`    | Compile TypeScript to `dist/`        |
| `npm run start`    | Run production server from `dist/`   |
| `npm run terminal` | Launch interactive terminal agent    |

## Extending the Template

**Add a new tool:**

1. Create `tools/my-tool/my-tool.ts` implementing the tool interface
2. Register it in the agent's tool list in `controller/deep-agent/deep-agent.ts`

**Add a new skill:**

1. Create `skills/my-skill/my-skill.ts`
2. Compose multiple tools under a single skill namespace

**Add a new subagent:**

1. Create `subagents/my-subagent/my-subagent.ts`
2. Wire it into the main agent flow in the controller

## License

MIT — fork it and build on top of it.
