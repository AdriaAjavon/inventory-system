import prisma from "../prisma/prismaClient.js";

// ==========================================
// Get All Sales
// ==========================================

export const getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(sales);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ==========================================
// Get Receipt
// ==========================================

export const getReceipt = async (req, res) => {
  try {
    const { receiptNumber } = req.params;

    const sale = await prisma.sale.findUnique({
      where: {
        receiptNumber,
      },
    });

    if (!sale) {
      return res.status(404).json({
        error: "Receipt not found",
      });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ==========================================
// Create Sale
// ==========================================

export const createSale = async (req, res) => {
  try {
    const {
      productName,
      quantity,
      paymentMethod,
    } = req.body;

    const product = await prisma.product.findFirst({
      where: {
        name: productName,
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        error: "Insufficient stock",
      });
    }

    const saleCount = await prisma.sale.count();

    const receiptNumber = `RCP-${String(
      saleCount + 1
    ).padStart(6, "0")}`;

    const totalAmount = product.price * quantity;

    const newStock = product.stock - quantity;

    let sale;

    await prisma.$transaction(async (tx) => {

      // ==============================
      // Create Sale
      // ==============================

      sale = await tx.sale.create({
        data: {
          receiptNumber,
          productName,
          quantity,
          unitPrice: product.price,
          totalAmount,
          paymentMethod,
        },
      });

      // ==============================
      // Update Product Stock
      // ==============================

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: newStock,
        },
      });

      // ==============================
      // Sale Activity
      // ==============================

      await tx.activityLog.create({
        data: {
          action: "Sale Completed",
          productName,
          details: `${quantity} unit(s) sold`,
        },
      });

      // ==============================
      // Opening Stock Finished
      // ==============================

      if (
        product.stockStatus === "OPENING_STOCK" &&
        newStock <= 0
      ) {

        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            stockStatus: "WAITING_FOR_RESTOCK",
          },
        });

        await tx.activityLog.create({
          data: {
            action: "Opening Stock Finished",
            productName,
            details:
              "Opening stock sold out. Waiting for first verified restock.",
          },
        });

      }

    });

    res.status(201).json({
      sale,
      receiptNumber,
      totalAmount,
      paymentMethod,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};