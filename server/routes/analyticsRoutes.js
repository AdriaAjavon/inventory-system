import express from "express";

import {
  getAnalyticsData,
} from "../controllers/analyticsController.js";

const router = express.Router();

// ==========================================
// Business Health / Analytics
// ==========================================

router.get(
  "/",
  getAnalyticsData
);

export default router;