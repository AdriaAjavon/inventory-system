import express from "express";

import {
  getProducts,
  createProduct,
  updateProductStock,
  deleteProduct,
  importProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", createProduct);

router.post("/import", importProducts);

router.patch("/:id/stock", updateProductStock);

router.delete("/:id", deleteProduct);

export default router;