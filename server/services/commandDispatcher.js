import prisma from "../prisma/prismaClient.js";

import commandAliases from "./commandAliases.js";

import { getBusinessAnalytics } from "./analytics/businessAnalytics.js";

// ======================================================
// Normalize Command
// ======================================================

function normalizeCommand(command) {
  const cmd = command.toLowerCase().trim();

  let normalizedCommand = cmd;

  for (const [officialCommand, aliases] of Object.entries(commandAliases)) {
    if (
      aliases.some((alias) =>
        cmd.includes(alias.toLowerCase())
      )
    ) {
      normalizedCommand = officialCommand;
      break;
    }
  }

  return {
    cmd,
    normalizedCommand,
  };
}

// ======================================================
// Dispatcher
// ======================================================

export async function dispatchCommand(command) {
  try {
    const { cmd, normalizedCommand } =
      normalizeCommand(command);

    // ==========================================
    // TODAY SALES
    // ==========================================

    if (normalizedCommand === "today sales") {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const sales = await prisma.sale.findMany({
        where: {
          createdAt: {
            gte: today,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        type: "todaySales",

        title: "Today's Sales",

        message: `You completed ${sales.length} sale(s) today.`,

        data: {
          sales: sales.length,
          receipts: sales,
        },
      };
    }

    // ==========================================
    // TODAY REVENUE
    // ==========================================

    if (normalizedCommand === "today revenue") {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const sales = await prisma.sale.findMany({
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

      const revenue = sales.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0
      );

      return {
        type: "todayRevenue",

        title: "Today's Revenue",

        message: `Today's revenue is $${revenue.toFixed(
          2
        )}.`,

        data: {
          revenue,

          sales: sales.length,

          averageSale:
            sales.length > 0
              ? revenue / sales.length
              : 0,
        },
      };
    }

    // ==========================================
    // LOW STOCK
    // ==========================================

    if (normalizedCommand === "low stock") {
      const analytics = await getBusinessAnalytics();

      return {
        type: "lowStock",

        title: "Low Stock Products",

        message: `${analytics.lowStockProducts.length} product(s) need restocking.`,

        data: {
          products: analytics.lowStockProducts,
        },
      };
    }

    // ==========================================
    // INVENTORY VALUE
    // ==========================================

    if (normalizedCommand === "inventory value") {
      const analytics = await getBusinessAnalytics();

      return {
        type: "inventoryValue",

        title: "Inventory Value",

        message: `Current inventory value is $${analytics.inventoryValue.toFixed(
          2
        )}.`,

        data: {
          inventoryValue: analytics.inventoryValue,

          totalProducts: analytics.totalProducts,
        },
      };
    }

    // ==========================================
    // BUSINESS HEALTH
    // ==========================================

    if (normalizedCommand === "business health") {
      const analytics = await getBusinessAnalytics();

      return {
        type: "businessHealth",

        title: "Business Health",

        message: analytics.summary,

        data: {
          score: analytics.businessHealth,

          revenue: analytics.revenue,

          sales: analytics.sales,

          inventoryValue: analytics.inventoryValue,

          averageSale: analytics.averageSale,

          totalProducts: analytics.totalProducts,

          lowStockProducts:
            analytics.lowStockProducts.length,

          activityCount:
            analytics.activityCount,
        },
      };
    }

    // ==========================================
    // BUSINESS ANALYTICS
    // ==========================================

    if (
      normalizedCommand === "business analytics" ||
      normalizedCommand === "analytics"
    ) {
      const analytics = await getBusinessAnalytics();

      return {
        type: "analytics",

        title: "Business Analytics",

        message: analytics.summary,

        data: analytics,
      };
    }

    // ==========================================
    // PRODUCT SEARCH
    // ==========================================

    if (cmd.startsWith("product ")) {
      const search = command
        .replace(/product/i, "")
        .trim();

      const product =
        await prisma.product.findFirst({
          where: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        });

      if (!product) {
        return {
          type: "productNotFound",

          title: "Product Search",

          message: `No product named "${search}" was found.`,

          data: {},
        };
      }

      return {
        type: "product",

        title: product.name,

        message: `${product.name} currently has ${product.stock} unit(s) available.`,

        data: product,
      };
    }

    // ==========================================
    // SEARCH PRODUCTS
    // ==========================================

    if (cmd.startsWith("search ")) {
      const keyword = command
        .replace(/search/i, "")
        .trim();

      const products =
        await prisma.product.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
            ],
          },

          orderBy: {
            name: "asc",
          },

          take: 10,
        });

      return {
        type: "search",

        title: "Search Results",

        message:
          products.length > 0
            ? `Found ${products.length} matching product(s).`
            : "No matching products were found.",

        data: products,
      };
    }

    // ==========================================
    // PRODUCT COUNT
    // ==========================================

    if (
      normalizedCommand === "products" ||
      normalizedCommand === "inventory"
    ) {
      const products =
        await prisma.product.findMany({
          orderBy: {
            name: "asc",
          },
        });

      return {
        type: "products",

        title: "Inventory",

        message: `You currently have ${products.length} product(s) in inventory.`,

        data: products,
      };
    }

    // ==========================================
    // RECENT SALES
    // ==========================================

    if (
      normalizedCommand === "sales history" ||
      normalizedCommand === "history"
    ) {
      const sales =
        await prisma.sale.findMany({
          orderBy: {
            createdAt: "desc",
          },

          take: 20,
        });

      return {
        type: "salesHistory",

        title: "Sales History",

        message: `Showing your ${sales.length} most recent sale(s).`,

        data: sales,
      };
    }

    // ==========================================
    // HELP
    // ==========================================

    if (
      normalizedCommand === "help" ||
      normalizedCommand === "commands"
    ) {
      return {
        type: "help",

        title: "Available Commands",

        message:
          "Here are some commands you can ask me.",

        data: {
          commands: [
            "today sales",
            "today revenue",
            "business analytics",
            "business health",
            "inventory value",
            "low stock",
            "products",
            "sales history",
            "product Coca Cola",
            "search water",
            "help",
          ],
        },
      };
    }

    // ==========================================
    // UNKNOWN COMMAND
    // ==========================================

    return {
      type: "unknown",

      title: "Unknown Command",

      message:
        "Sorry, I don't understand that command yet. Type 'help' to see available commands.",

      data: {},
    };
  }

  // ==========================================
  // GLOBAL ERROR HANDLER
  // ==========================================

  catch (error) {
    console.error(
      "Command Dispatcher Error:",
      error
    );

    return {
      type: "error",

      title: "Server Error",

      message:
        "Something went wrong while processing your request.",

      data: {
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
    };
  }
}