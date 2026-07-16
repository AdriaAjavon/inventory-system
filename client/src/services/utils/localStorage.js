const STORAGE_KEY = "inventory_business_copilot";

export function saveConversation(messages) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error("Failed to save conversation:", error);
  }
}

export function loadConversation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load conversation:", error);
    return null;
  }
}

export function clearConversationStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear conversation:", error);
  }
}