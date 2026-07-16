export function executeVoiceCommand(transcript = "") {
  const command = transcript
    .trim()
    .toLowerCase();

  // -----------------------------
  // Dashboard
  // -----------------------------

  if (
    command === "dashboard" ||
    command === "home" ||
    command === "go home"
  ) {
    return {
      type: "navigation",
      command: "dashboard",
    };
  }

  // -----------------------------
  // Products
  // -----------------------------

  if (
    command === "products" ||
    command === "inventory" ||
    command === "open products" ||
    command === "add product"
  ) {
    return {
      type: "navigation",
      command: "products",
    };
  }

  // -----------------------------
  // Sales
  // -----------------------------

  if (
    command === "sales" ||
    command === "sale" ||
    command === "new sale"
  ) {
    return {
      type: "navigation",
      command: "sales",
    };
  }

  // -----------------------------
  // Sales History
  // -----------------------------

  if (
    command === "sales history" ||
    command === "history"
  ) {
    return {
      type: "navigation",
      command: "sales-history",
    };
  }

  // -----------------------------
  // Activity
  // -----------------------------

  if (
    command === "activity" ||
    command === "logs"
  ) {
    return {
      type: "navigation",
      command: "activity",
    };
  }

  // -----------------------------
  // Business Commands
  // -----------------------------

  if (
    command === "today sales"
  ) {
    return {
      type: "business",
      command: "today sales",
    };
  }

  if (
    command === "today revenue"
  ) {
    return {
      type: "business",
      command: "today revenue",
    };
  }

  if (
    command === "low stock"
  ) {
    return {
      type: "business",
      command: "low stock",
    };
  }

  if (
    command === "business health"
  ) {
    return {
      type: "business",
      command: "business health",
    };
  }

  if (
    command === "inventory value"
  ) {
    return {
      type: "business",
      command: "inventory value",
    };
  }

  // -----------------------------
  // Unknown
  // -----------------------------

  return {
    type: "unknown",
    command,
  };
}