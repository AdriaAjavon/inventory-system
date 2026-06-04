import prisma from "../prisma/prismaClient.js";

export const getSales = async (
  req,
  res
) => {
  try {
    const sales =
      await prisma.sale.findMany({
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

export const createSale = async (
  req,
  res
) => {
  try {
    const {
      productName,
      quantity,
      paymentMethod,
    } = req.body;

    const product =
      await prisma.product.findFirst({
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

    const saleCount =
      await prisma.sale.count();

    const receiptNumber = `RCP-${String(
      saleCount + 1
    ).padStart(6, "0")}`;

    const totalAmount =
      product.price * quantity;

    const sale =
      await prisma.sale.create({
        data: {
          receiptNumber,
          productName,
          quantity,
          unitPrice: product.price,
          totalAmount,
          paymentMethod,
        },
      });

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        stock:
          product.stock - quantity,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "Sale Completed",
        productName,
      },
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};