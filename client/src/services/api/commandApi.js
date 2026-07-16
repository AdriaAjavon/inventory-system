import { post } from "./apiClient";

// ----------------------------------
// Execute Business Command
// ----------------------------------

export async function executeCommand(
  command
) {
  return await post(
    "/api/command",
    {
      command,
    }
  );
}

// ----------------------------------
// Future AI Chat Endpoint
// ----------------------------------

export async function askCopilot(
  message
) {
  return await post(
    "/api/command/chat",
    {
      message,
    }
  );
}

// ----------------------------------
// Future Voice Command Endpoint
// ----------------------------------

export async function executeVoiceCommand(
  transcript
) {
  return await post(
    "/api/command/voice",
    {
      transcript,
    }
  );
}