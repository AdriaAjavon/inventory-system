import prisma from "../prisma/prismaClient.js";

export async function getDashboardData() {
  // ----------------------------
  // Products
  // ----------------------------

  const totalProducts = await prisma.product.count();

  const lowStock = await prisma.product.count({
    where: {
      stock: {
        lte: 5,
      },
    },
  });

  // ----------------------------
  // Today's Sales
  // ----------------------------

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const salesToday = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const todaySales = salesToday.length;

  const todayRevenue = salesToday.reduce(
    (total, sale) => total + sale.totalAmount,
    0
  );

  // ----------------------------
  // Inventory Value
  // ----------------------------

  const inventory = await prisma.product.findMany();

  const inventoryValue = inventory.reduce(
    (total, product) =>
      total + product.price * product.stock,
    0
  );

  // ----------------------------
  // Recent Activity
  // ----------------------------

  const recentActivity =
    await prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

  // ----------------------------
  // Business Health
  // ----------------------------

  let businessHealth = 100;

  if (lowStock > 0) {
    businessHealth -= lowStock * 5;
  }

  if (todaySales === 0) {
    businessHealth -= 10;
  }

  if (businessHealth < 50) {
    businessHealth = 50;
  }

  return {
    totalProducts,
    lowStock,
    todaySales,
    todayRevenue,
    inventoryValue,
    businessHealth,
    recentActivity,
  };
}