import xlsx from "xlsx";

import prisma from "../prisma/prismaClient.js";

export const importProducts = async (
  req,
  res
) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded.",
      });
    }

    const workbook =
      xlsx.read(req.file.buffer, {
        type: "buffer",
      });

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows =
      xlsx.utils.sheet_to_json(sheet);

    let imported = 0;
    let skipped = 0;

    const duplicates = [];
    const invalidRows = [];

    for (const row of rows) {

      const name =
        row.name ??
        row.Name;

      const category =
        row.category ??
        row.Category;

      const stock = Number(
        row.stock ??
        row.Stock ??
        0
      );

      const price = Number(
        row.price ??
        row.Price ??
        0
      );

      // Required fields

      if (
        !name ||
        !category
      ) {

        skipped++;

        invalidRows.push({
          name:
            name ??
            "Unknown Product",
          reason:
            "Missing required fields",
        });

        continue;

      }

      // Duplicate check

      const existing =
        await prisma.product.findFirst({
          where: {
            name,
          },
        });

      if (existing) {

        skipped++;

        duplicates.push(name);

        continue;

      }

      try {

        const createdProduct =
          await prisma.product.create({
            data: {
              name,
              category,
              stock,
              price,
            },
          });

        await prisma.activityLog.create({
          data: {
            action:
              "Imported Product",
            productName:
              createdProduct.name,
          },
        });

        imported++;

      } catch (error) {

        skipped++;

        invalidRows.push({
          name,
          reason:
            error.message,
        });

      }

    }

    res.json({

      success: true,

      imported,

      skipped,

      duplicates,

      invalidRows,

      message:
        `${imported} product(s) imported successfully. ${skipped} skipped.`,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });

  }
};