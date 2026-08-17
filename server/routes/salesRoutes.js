import express from "express";

import {
  getSales,
  createSale,
  getReceipt,
} from "../controllers/salesController.js";

const router = express.Router();

// ==========================================
// Sales
// ==========================================

router.get("/", getSales);

router.post("/", createSale);

// ==========================================
// Receipt
// ==========================================

router.get(
  "/receipt/:receiptNumber",
  getReceipt
);

export default router;