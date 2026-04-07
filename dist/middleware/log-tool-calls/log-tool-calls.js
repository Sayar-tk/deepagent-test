"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logToolCallsMiddleware = void 0;
const langchain_1 = require("langchain");
let callCount = 0;
exports.logToolCallsMiddleware = (0, langchain_1.createMiddleware)({
    name: "LogToolCallsMiddleware",
    wrapToolCall: async (request, handler) => {
        // Intercept and log every tool call - demonstrates cross-cutting concern
        callCount += 1;
        const toolName = request.toolCall.name;
        console.log(`[Middleware] Tool call #${callCount}: ${toolName}`);
        console.log(`[Middleware] Arguments: ${JSON.stringify(request.toolCall.args)}`);
        // Execute the tool call
        const result = await handler(request);
        // Log the result
        console.log(`[Middleware] Tool call #${callCount} completed`);
        return result;
    },
});
