import { getDashboardData as getDashboardService } from "../services/dashboardService.js";

export const getDashboardData = async (
  req,
  res
) => {
  try {
    const dashboardData =
      await getDashboardService();

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};