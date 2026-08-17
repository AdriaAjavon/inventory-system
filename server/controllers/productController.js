import prisma from "../prisma/prismaClient.js";
import fs from "fs";
import csv from "csv-parser";

// =============================================
// Constants
// =============================================

const STOCK_STATUS = {
  OPENING: "OPENING_STOCK",
  WAITING: "WAITING_FOR_RESTOCK",
  ACTIVE: "ACTIVE",
};

// =============================================
// Get All Products
// =============================================

export const getProducts = async (
  req,
  res
) => {
  try {
    const products =
      await prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =============================================
// Create Product
// =============================================

export const createProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      category,
      stock,
      price,
    } = req.body;

    // ✅ Validation
    if (!name || !category) {
      return res.status(400).json({
        error: "Name and category are required.",
      });
    }

    const stockNum = Number(stock);
    const priceNum = Number(price);

    if (isNaN(stockNum) || isNaN(priceNum)) {
      return res.status(400).json({
        error: "Stock and price must be valid numbers.",
      });
    }

    if (stockNum < 0 || priceNum < 0) {
      return res.status(400).json({
        error: "Stock and price cannot be negative.",
      });
    }

    if (priceNum === 0) {
      return res.status(400).json({
        error: "Price cannot be zero.",
      });
    }

    const product =
      await prisma.product.create({
        data: {
          name,
          category,
          stock: stockNum,
          price: priceNum,
          // Every manually entered product starts as opening stock
          stockStatus: STOCK_STATUS.OPENING,
        },
      });

    await prisma.activityLog.create({
      data: {
        action: "Added Product",
        productName: name,
        details: `Opening stock: ${stock}`,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =============================================
// Import Products from CSV
// =============================================

export const importProducts = async (
  req,
  res
) => {
  console.log("========== IMPORT HIT ==========");
  console.log("File:", req.file);
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No CSV file uploaded.",
      });
    }

    const products = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        const stockNum = Number(row.stock);
        const priceNum = Number(row.price);

        // Skip invalid rows
        if (isNaN(stockNum) || isNaN(priceNum)) {
          console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
          return;
        }

        products.push({
          name: row.name,
          category: row.category,
          stock: stockNum,
          price: priceNum,
          // Imported inventory is treated as opening stock
          stockStatus: STOCK_STATUS.OPENING,
        });
      })
      .on("end", async () => {
        try {
          await prisma.product.createMany({
            data: products,
            skipDuplicates: true,
          });

          await prisma.activityLog.create({
            data: {
              action: "Imported Products",
              productName: `${products.length} Products`,
              details: `${products.length} product(s) imported from CSV`,
            },
          });

          // ✅ Safe cleanup
          try {
            fs.unlinkSync(req.file.path);
          } catch (err) {
            console.error("Failed to delete CSV file:", err);
          }

          return res.json({
            success: true,
            message: `${products.length} products imported successfully.`,
            imported: products.length,
          });

        } catch (error) {

          return res.status(500).json({
            success: false,
            message: error.message,
          });

        }
      });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =============================================
// Update Product (Full Update)
// =============================================

export const updateProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      stock,
      price,
    } = req.body;

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });

    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    // ✅ Validation
    if (!name || !category) {
      return res.status(400).json({
        error: "Name and category are required.",
      });
    }

    const stockNum = Number(stock);
    const priceNum = Number(price);

    if (isNaN(stockNum) || isNaN(priceNum)) {
      return res.status(400).json({
        error: "Stock and price must be valid numbers.",
      });
    }

    if (stockNum < 0 || priceNum < 0) {
      return res.status(400).json({
        error: "Stock and price cannot be negative.",
      });
    }

    if (priceNum === 0) {
      return res.status(400).json({
        error: "Price cannot be zero.",
      });
    }

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          category,
          stock: stockNum,
          price: priceNum,
        },
      });

    await prisma.activityLog.create({
      data: {
        action: "Updated Product",
        productName: updatedProduct.name,
        details: "Product information updated",
      },
    });

    res.json(updatedProduct);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

// =============================================
// Update Product Stock (Manual Adjustment)
// =============================================

export const updateProductStock = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const { stock } = req.body;

    // ✅ Validation
    if (stock === undefined || stock === null) {
      return res.status(400).json({
        error: "Stock value is required.",
      });
    }

    const stockNum = Number(stock);

    if (isNaN(stockNum)) {
      return res.status(400).json({
        error: "Stock must be a valid number.",
      });
    }

    if (stockNum < 0) {
      return res.status(400).json({
        error: "Stock cannot be negative.",
      });
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });

    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: Number(id),
        },
        data: {
          stock: stockNum,
        },
      });

    await prisma.activityLog.create({
      data: {
        action: "Adjusted Stock",
        productName: updatedProduct.name,
        details: `Stock manually changed to ${updatedProduct.stock}`,
      },
    });

    res.json(updatedProduct);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

// =============================================
// Receive Stock from Supplier
// =============================================

export const receiveStock = async (req, res) => {
  try {

    const { id } = req.params;
    const { quantity } = req.body;

    // ✅ Validation
    if (!quantity && quantity !== 0) {
      return res.status(400).json({
        error: "Quantity is required.",
      });
    }

    const quantityNum = Number(quantity);

    if (isNaN(quantityNum)) {
      return res.status(400).json({
        error: "Quantity must be a valid number.",
      });
    }

    if (quantityNum <= 0) {
      return res.status(400).json({
        error: "Quantity must be greater than zero.",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const newStock =
      product.stock + quantityNum;

    // ✅ Optimized: Return updated product from transaction
    let updatedProduct;

    await prisma.$transaction(async (tx) => {

      if (product.stockStatus === STOCK_STATUS.WAITING) {

        updatedProduct = await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            stock: newStock,
            stockStatus: STOCK_STATUS.ACTIVE,
          },
        });

        await tx.activityLog.create({
          data: {
            action: "First Verified Restock",
            productName: product.name,
            details: `${quantityNum} unit(s) received. Product is now ACTIVE.`,
          },
        });

      } else {

        updatedProduct = await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            stock: newStock,
          },
        });

        await tx.activityLog.create({
          data: {
            action: "Stock Received",
            productName: product.name,
            details: `${quantityNum} unit(s) received.`,
          },
        });

      }

    });

    // ✅ Return the updated product from the transaction
    res.json(updatedProduct);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

// =============================================
// Delete Product
// =============================================

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const product =
      await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });

    // ✅ Check if product exists before deleting
    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "Deleted Product",
        productName: product.name,
        details: "Product removed from inventory",
      },
    });

    res.json({
      message:
        "Product deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

// =============================================
// Check Product Stock
// =============================================

export const checkProductStock = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        stock: true,
        stockStatus: true, // ✅ Added for completeness
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product: product,
      inStock: product.stock > 0,
      stockLevel: product.stock,
      stockStatus: product.stockStatus,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};