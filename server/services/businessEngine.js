import { getDashboardData } from "./dashboardService.js";

class BusinessEngine {
  // ----------------------------
  // Dashboard
  // ----------------------------

  async getDashboard() {
    return await getDashboardData();
  }

  // ----------------------------
  // Business Health
  // ----------------------------

  async getBusinessHealth() {
    const dashboard =
      await getDashboardData();

    return {
      score: dashboard.businessHealth,
      revenue: dashboard.todayRevenue,
      sales: dashboard.todaySales,
      lowStock: dashboard.lowStock,
      inventoryValue:
        dashboard.inventoryValue,
    };
  }

  // ----------------------------
  // Inventory Summary
  // ----------------------------

  async getInventorySummary() {
    const dashboard =
      await getDashboardData();

    return {
      totalProducts:
        dashboard.totalProducts,

      lowStock:
        dashboard.lowStock,

      inventoryValue:
        dashboard.inventoryValue,
    };
  }

  // ----------------------------
  // Sales Summary
  // ----------------------------

  async getSalesSummary() {
    const dashboard =
      await getDashboardData();

    return {
      todaySales:
        dashboard.todaySales,

      todayRevenue:
        dashboard.todayRevenue,
    };
  }
}

export default new BusinessEngine();