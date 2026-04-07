"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("node:readline/promises"));
const node_process_1 = require("node:process");
const rl = readline.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout });
const API_URL = "http://localhost:3000/agent/deep-agent";
async function sendMessage(message) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
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
    console.log("Type 'exit' or 'quit' to stop\n");
    while (true) {
        const input = await rl.question("you> ");
        if (!input || input.trim() === "")
            continue;
        const trimmed = input.trim().toLowerCase();
        if (trimmed === "exit" || trimmed === "quit") {
            console.log("Goodbye!");
            break;
        }
        try {
            process.stdout.write("agent> ");
            const response = await sendMessage(input);
            console.log(response);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            console.log(`Error: ${message}`);
        }
    }
    rl.close();
}
main();
