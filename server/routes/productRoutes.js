import express from "express";
import multer from "multer";

import {
  getProducts,
  createProduct,
  updateProductStock,
  deleteProduct,
  importProducts,
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

router.patch("/:id/stock", updateProductStock);

router.delete("/:id", deleteProduct);

export default router;