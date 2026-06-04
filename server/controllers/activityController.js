import prisma from "../prisma/prismaClient.js";

export const getActivityLogs = async (
  req,
  res
) => {
  try {
    const logs =
      await prisma.activityLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};