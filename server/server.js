import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Inventory API Running...");
});

app.use("/api/products", productRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/activity", activityRoutes);

app.use("/api/sales", salesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});