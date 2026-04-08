import { createMiddleware } from "langchain";

const SKILLS_SEGMENT = "/skills/";

const extractPathArg = (args: unknown): string | undefined => {
  if (!args || typeof args !== "object") return undefined;

  const record = args as Record<string, unknown>;
  const possible = [record.file_path, record.path, record.filePath, record.skillPath];

  for (const value of possible) {
    if (typeof value === "string") return value;
  }

  return undefined;
};

const isSkillUsage = (toolName: string, args: unknown): boolean => {
  const pathArg = extractPathArg(args);
  if (pathArg && pathArg.includes(SKILLS_SEGMENT)) return true;

  if (typeof args === "string") {
    return args.includes(SKILLS_SEGMENT) || args.includes("SKILL.md");
  }

  if (args && typeof args === "object") {
    const serialized = JSON.stringify(args);
    return serialized.includes(SKILLS_SEGMENT) || serialized.includes("SKILL.md");
  }

  return toolName.toLowerCase().includes("skill");
};

export const logSkillUsageMiddleware = createMiddleware({
  name: "LogSkillUsageMiddleware",
  wrapToolCall: async (request, handler) => {
    const toolName = request.toolCall.name;
    const args = request.toolCall.args;
    const skillUsed = isSkillUsage(toolName, args);

    if (skillUsed) {
      const pathArg = extractPathArg(args) ?? "unknown-skill-path";
      console.log(`[SkillUsage] Tool=${toolName} Path=${pathArg}`);
    }

    return await handler(request);
  },
});
