// Normalize user commands before sending them to the backend

export function parseCommand(input) {
  if (!input) return "";

  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[?.!,]/g, "");
}