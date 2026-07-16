import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import commandRoutes from "./routes/commandRoutes.js";

dotenv.config();

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.send("🚀 InventorySys API Running...");
});

// ==========================================
// API Routes
// ==========================================

// Products
app.use("/api/products", productRoutes);

// AI
app.use("/api/ai", aiRoutes);

// Activity
app.use("/api/activity", activityRoutes);

// Sales
app.use("/api/sales", salesRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Business Command Center
app.use("/api/command", commandRoutes);

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ==========================================
// Global Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 InventorySys API running on port ${PORT}`
  );
});