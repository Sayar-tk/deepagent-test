import { tool } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import { z } from "zod";

const webSearch = tool(
  async ({
    query,
    maxResults = 5,
    topic = "general",
    includeRawContent = false,
  }: {
    query: string;
    maxResults?: number;
    topic?: string;
    includeRawContent?: boolean;
  }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error("TAVILY_API_KEY is not set in environment variables");
    }

    // Normalize topic to what Tavily expects
    const validTopic: "general" | "news" =
      topic?.toLowerCase() === "news" ? "news" : "general";

    const tavilySearch = new TavilySearch({
      maxResults,
      topic: validTopic,
      includeRawContent,
      tavilyApiKey: apiKey,
    });
    return await tavilySearch.invoke({ query });
  },
  {
    name: "web_search",
    description: "Run a web search using Tavily",
    schema: z.object({
      query: z.string().describe("The search query"),
      maxResults: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of results"),
      topic: z
        .string()
        .optional()
        .default("general")
        .describe(
          "The type of search. Use 'news' for news/current events, 'general' for everything else. Defaults to 'general'.",
        ),
      includeRawContent: z
        .boolean()
        .optional()
        .default(false)
        .describe("Whether to include raw page content in results"),
    }),
  },
);

export default webSearch;
