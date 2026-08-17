import {
  getAnalyticsData as getAnalyticsService,
} from "../services/analyticsService.js";

// ==========================================
// Business Health / Analytics
// ==========================================

export const getAnalyticsData = async (
  req,
  res
) => {
  try {
    const analyticsData =
      await getAnalyticsService();

    res.json(analyticsData);
  } catch (error) {
    console.error(
      "Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};