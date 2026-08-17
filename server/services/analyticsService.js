import prisma from "../prisma/prismaClient.js";

// ==========================================
// Business Health / Analytics
// ==========================================

export async function getAnalyticsData() {
  const now = new Date();

  // ==========================================
  // Date Ranges
  // ==========================================

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(
    startOfWeek.getDate() - 6
  );
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  // ==========================================
  // Sales
  // ==========================================

  const sales = await prisma.sale.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const todaySales = sales.filter(
    (sale) =>
      new Date(sale.createdAt) >=
      startOfToday
  );

  const weekSales = sales.filter(
    (sale) =>
      new Date(sale.createdAt) >=
      startOfWeek
  );

  const monthSales = sales.filter(
    (sale) =>
      new Date(sale.createdAt) >=
      startOfMonth
  );

  // ==========================================
  // Revenue Helper
  // ==========================================

  const calculateRevenue = (salesList) =>
    salesList.reduce(
      (total, sale) =>
        total + Number(sale.totalAmount || 0),
      0
    );

  const calculateUnits = (salesList) =>
    salesList.reduce(
      (total, sale) =>
        total + Number(sale.quantity || 0),
      0
    );

  // ==========================================
  // Revenue
  // ==========================================

  const todayRevenue =
    calculateRevenue(todaySales);

  const weekRevenue =
    calculateRevenue(weekSales);

  const monthRevenue =
    calculateRevenue(monthSales);

  // ==========================================
  // Units Sold
  // ==========================================

  const todayUnits =
    calculateUnits(todaySales);

  const weekUnits =
    calculateUnits(weekSales);

  const monthUnits =
    calculateUnits(monthSales);

  // ==========================================
  // Average Transaction
  // ==========================================

  const averageTransaction =
    monthSales.length > 0
      ? monthRevenue /
        monthSales.length
      : 0;

  // ==========================================
  // Product Inventory
  // ==========================================

  const products =
    await prisma.product.findMany();

  const totalProducts =
    products.length;

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <= 10
    );

  const outOfStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) === 0
    );

  const inventoryValue =
    products.reduce(
      (total, product) =>
        total +
        Number(product.price || 0) *
          Number(product.stock || 0),
      0
    );

  // ==========================================
  // Best Selling Products
  // ==========================================

  const productSales = {};

  monthSales.forEach((sale) => {
    const name =
      sale.productName;

    if (!productSales[name]) {
      productSales[name] = {
        productName: name,
        unitsSold: 0,
        revenue: 0,
      };
    }

    productSales[name].unitsSold +=
      Number(sale.quantity || 0);

    productSales[name].revenue +=
      Number(sale.totalAmount || 0);
  });

  const bestSellingProducts =
    Object.values(productSales)
      .sort(
        (a, b) =>
          b.unitsSold -
          a.unitsSold
      )
      .slice(0, 5);

  // ==========================================
  // Revenue By Category
  // ==========================================

  const categoryMap = {};

  monthSales.forEach((sale) => {
    const product =
      products.find(
        (item) =>
          item.name ===
          sale.productName
      );

    const category =
      product?.category ||
      "Uncategorized";

    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        revenue: 0,
        unitsSold: 0,
      };
    }

    categoryMap[category].revenue +=
      Number(sale.totalAmount || 0);

    categoryMap[category].unitsSold +=
      Number(sale.quantity || 0);
  });

  const revenueByCategory =
    Object.values(categoryMap)
      .sort(
        (a, b) =>
          b.revenue -
          a.revenue
      );

  // ==========================================
  // Daily Revenue - Last 7 Days
  // ==========================================

  const dailyRevenue = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);

    date.setDate(
      now.getDate() - i
    );

    date.setHours(0, 0, 0, 0);

    const nextDate =
      new Date(date);

    nextDate.setDate(
      date.getDate() + 1
    );

    const daySales =
      sales.filter((sale) => {
        const saleDate =
          new Date(
            sale.createdAt
          );

        return (
          saleDate >= date &&
          saleDate < nextDate
        );
      });

    dailyRevenue.push({
      date:
        date.toISOString().split("T")[0],
      revenue:
        calculateRevenue(
          daySales
        ),
      sales:
        daySales.length,
      units:
        calculateUnits(
          daySales
        ),
    });
  }

  // ==========================================
  // Business Health Score
  // ==========================================

  let businessHealth = 100;

  if (outOfStockProducts.length > 0) {
    businessHealth -=
      Math.min(
        outOfStockProducts.length * 3,
        20
      );
  }

  if (lowStockProducts.length > 0) {
    businessHealth -=
      Math.min(
        lowStockProducts.length * 2,
        15
      );
  }

  if (todaySales.length === 0) {
    businessHealth -= 10;
  }

  businessHealth =
    Math.max(
      0,
      Math.min(
        100,
        businessHealth
      )
    );

  // ==========================================
  // Return Analytics
  // ==========================================

  return {
    overview: {
      todayRevenue,
      weekRevenue,
      monthRevenue,

      todaySales:
        todaySales.length,

      weekSales:
        weekSales.length,

      monthSales:
        monthSales.length,

      todayUnits,
      weekUnits,
      monthUnits,

      averageTransaction,
    },

    inventory: {
      totalProducts,
      inventoryValue,

      lowStock:
        lowStockProducts.length,

      outOfStock:
        outOfStockProducts.length,
    },

    bestSellingProducts,

    revenueByCategory,

    dailyRevenue,

    businessHealth,
  };
}