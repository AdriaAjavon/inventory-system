import prisma from "../prisma/prismaClient.js";

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