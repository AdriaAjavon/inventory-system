// ======================================================
// AI Response Builder
// Centralizes all AI messages returned to the frontend.
// ======================================================

export function buildResponse(type, data = {}) {
  switch (type) {
    // ------------------------------------------
    // Today's Sales
    // ------------------------------------------

    case "todaySales":
      return {
        title: "Today's Sales",
        message: `You completed ${data.sales} sale(s) today.`,
      };

    // ------------------------------------------
    // Today's Revenue
    // ------------------------------------------

    case "todayRevenue":
      return {
        title: "Today's Revenue",
        message: `Today's revenue is $${Number(
          data.revenue || 0
        ).toFixed(2)} from ${data.sales || 0} sale(s).`,
      };

    // ------------------------------------------
    // Inventory Value
    // ------------------------------------------

    case "inventoryValue":
      return {
        title: "Inventory Value",
        message: `Current inventory value is $${Number(
          data.inventoryValue || 0
        ).toFixed(2)} across ${
          data.totalProducts || 0
        } product(s).`,
      };

    // ------------------------------------------
    // Low Stock
    // ------------------------------------------

    case "lowStock":
      return {
        title: "Low Stock",
        message:
          data.products?.length > 0
            ? `${data.products.length} product(s) need restocking.`
            : "Great! No products are currently low on stock.",
      };

    // ------------------------------------------
    // Business Health
    // ------------------------------------------

    case "businessHealth":
      return {
        title: "Business Health",
        message:
          data.summary ||
          `Business health score is ${data.score ?? 100}%.`,
      };

    // ------------------------------------------
    // Business Analytics
    // ------------------------------------------

    case "analytics":
      return {
        title: "Business Analytics",
        message:
          data.summary ||
          "Business analytics generated successfully.",
      };

    // ------------------------------------------
    // Product Search
    // ------------------------------------------

    case "product":
      return {
        title: data.name,
        message: `${data.name} currently has ${data.stock} unit(s) available.`,
      };

    // ------------------------------------------
    // Product Not Found
    // ------------------------------------------

    case "productNotFound":
      return {
        title: "Product Search",
        message:
          "No matching product could be found.",
      };

    // ------------------------------------------
    // Search
    // ------------------------------------------

    case "search":
      return {
        title: "Search Results",
        message: `Found ${
          data.length || 0
        } matching product(s).`,
      };

    // ------------------------------------------
    // Products
    // ------------------------------------------

    case "products":
      return {
        title: "Inventory",
        message: `You currently have ${
          data.length || 0
        } product(s) in inventory.`,
      };

    // ------------------------------------------
    // Sales History
    // ------------------------------------------

    case "salesHistory":
      return {
        title: "Sales History",
        message: `Showing ${
          data.length || 0
        } recent sale(s).`,
      };

    // ------------------------------------------
    // Help
    // ------------------------------------------

    case "help":
      return {
        title: "Available Commands",
        message:
          "Type a command or use your microphone to interact with the Business Copilot.",
      };

    // ------------------------------------------
    // Unknown
    // ------------------------------------------

    default:
      return {
        title: "Unknown Command",
        message:
          "I couldn't understand that command. Type 'help' to see the available commands.",
      };
  }
}