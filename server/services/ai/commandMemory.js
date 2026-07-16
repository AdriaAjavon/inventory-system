const memory = [];

export function remember(command, response) {
  memory.push({
    command,
    response,
    time: new Date(),
  });

  if (memory.length > 50) {
    memory.shift();
  }
}

export function getHistory() {
  return memory;
}

export function clearMemory() {
  memory.length = 0;
}

export function lastCommand() {
  return memory[memory.length - 1] || null;
}