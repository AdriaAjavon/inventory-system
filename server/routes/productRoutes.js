import express from "express";
import multer from "multer";

import {
  getProducts,
  createProduct,
  importProducts,
  updateProduct,
  updateProductStock,
  receiveStock,        // 👈 ADDED
  deleteProduct,
  checkProductStock,
} from "../controllers/productController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.get("/", getProducts);

router.post("/", createProduct);

router.post(
  "/import",
  upload.single("file"),
  importProducts
);

router.put("/:id", updateProduct);

router.put("/:id/stock", updateProductStock);

// Receive stock from supplier
router.put("/:id/receive", receiveStock);  // 👈 ADDED

router.delete("/:id", deleteProduct);

router.get("/:id/stock", checkProductStock);

export default router;