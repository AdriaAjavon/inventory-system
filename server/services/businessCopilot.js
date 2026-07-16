import { dispatchCommand } from "./commandDispatcher.js";

export async function businessCopilot(command) {
  const cleanedCommand = command
    .trim()
    .toLowerCase();

  // Future:
  // - AI Intent Detection
  // - Context Memory
  // - Voice Commands
  // - LLM Integration

  const result = await dispatchCommand(cleanedCommand);

  return {
    success: true,
    timestamp: new Date(),
    ...result,
  };
}