import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import commandRoutes from "./routes/commandRoutes.js";
import importRoutes from "./routes/importRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Inventory API Running...");
});

// ==========================================
// Product Routes
// ==========================================

app.use("/api/products", productRoutes);

// ==========================================
// Import Routes
// ==========================================

app.use("/api/import", importRoutes);

// ==========================================
// AI Routes
// ==========================================

app.use("/api/ai", aiRoutes);

// ==========================================
// Activity Routes
// ==========================================

app.use("/api/activity", activityRoutes);

// ==========================================
// Sales Routes
// ==========================================

app.use("/api/sales", salesRoutes);

// ==========================================
// Dashboard Routes
// ==========================================

app.use("/api/dashboard", dashboardRoutes);

// ==========================================
// Business Command Center
// ==========================================

app.use("/api/command", commandRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 InventorySys API running on port ${PORT}`
  );
});