import prisma from "../../prisma/prismaClient.js";

export async function getBusinessAnalytics() {
  const [products, sales, activity] = await Promise.all([
    prisma.product.findMany(),
    prisma.sale.findMany(),
    prisma.activityLog.findMany(),
  ]);

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );

  const totalSales = sales.length;

  const totalProducts = products.length;

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + product.price * product.stock,
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.stock <= 5
  );

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0
  );

  const averageSale =
    totalSales > 0
      ? totalRevenue / totalSales
      : 0;

  const activityCount = activity.length;

  //----------------------------------------------------
  // Business Health Score
  //----------------------------------------------------

  let businessHealth = 100;

  businessHealth -= lowStockProducts.length * 5;
  businessHealth -= outOfStockProducts.length * 10;

  if (businessHealth < 50) {
    businessHealth = 50;
  }

  //----------------------------------------------------
  // AI Summary
  //----------------------------------------------------

  let summary = "";

  if (totalProducts === 0) {
    summary =
      "Your inventory is currently empty. Start by adding products.";
  } else if (outOfStockProducts.length > 0) {
    summary =
      `Your business is operating with ${outOfStockProducts.length} out-of-stock product(s). Immediate restocking is recommended.`;
  } else if (lowStockProducts.length > 0) {
    summary =
      `Business is healthy overall, but ${lowStockProducts.length} product(s) are running low on stock.`;
  } else {
    summary =
      "Business is operating normally. Inventory levels look healthy.";
  }

  //----------------------------------------------------
  // Return Analytics
  //----------------------------------------------------

  return {

    revenue: totalRevenue,

    sales: totalSales,

    inventoryValue,

    averageSale,

    totalProducts,

    activityCount,

    lowStockProducts,

    outOfStockProducts,

    businessHealth,

    summary,

    generatedAt: new Date(),

  };
}