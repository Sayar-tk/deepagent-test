"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const langchain_1 = require("langchain");
const tavily_1 = require("@langchain/tavily");
const zod_1 = require("zod");
const webSearch = (0, langchain_1.tool)(async ({ query, maxResults = 5, topic = "general", includeRawContent = false, }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
        throw new Error("TAVILY_API_KEY is not set in environment variables");
    }
    // Normalize topic to what Tavily expects
    const validTopic = topic?.toLowerCase() === "news" ? "news" : "general";
    const tavilySearch = new tavily_1.TavilySearch({
        maxResults,
        topic: validTopic,
        includeRawContent,
        tavilyApiKey: apiKey,
    });
    return await tavilySearch.invoke({ query });
}, {
    name: "web_search",
    description: "Run a web search using Tavily",
    schema: zod_1.z.object({
        query: zod_1.z.string().describe("The search query"),
        maxResults: zod_1.z
            .number()
            .optional()
            .default(5)
            .describe("Maximum number of results"),
        topic: zod_1.z
            .string()
            .optional()
            .default("general")
            .describe("The type of search. Use 'news' for news/current events, 'general' for everything else. Defaults to 'general'."),
        includeRawContent: zod_1.z
            .boolean()
            .optional()
            .default(false)
            .describe("Whether to include raw page content in results"),
    }),
});
exports.default = webSearch;
