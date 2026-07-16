import prisma from "../prisma/prismaClient.js";
import fs from "fs";
import csv from "csv-parser";

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

    const product =
      await prisma.product.create({
        data: {
          name,
          category,
          stock: Number(stock),
          price: Number(price),
        },
      });

    await prisma.activityLog.create({
      data: {
        action: "Added Product",
        productName: name,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

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
        products.push({
          name: row.name,
          category: row.category,
          stock: Number(row.stock),
          price: Number(row.price),
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
            },
          });

          fs.unlinkSync(req.file.path);

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

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          category,
          stock: Number(stock),
          price: Number(price),
        },
      });

    await prisma.activityLog.create({
      data: {
        action: "Updated Product",
        productName: updatedProduct.name,
      },
    });

    res.json(updatedProduct);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

export const updateProductStock = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const { stock } = req.body;

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
          stock: Number(stock),
        },
      });

    await prisma.activityLog.create({
      data: {
        action: "Adjusted Stock",
        productName:
          updatedProduct.name,
      },
    });

    res.json(updatedProduct);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

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

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "Deleted Product",
        productName: product.name,
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
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};