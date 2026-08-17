import xlsx from "xlsx";
import prisma from "../prisma/prismaClient.js";

export const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded.",
      });
    }

    const workbook = xlsx.read(req.file.buffer, {
      type: "buffer",
    });

    const sheet =
      workbook.Sheets[workbook.SheetNames[0]];

    const rows =
      xlsx.utils.sheet_to_json(sheet);

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    const invalidRows = [];

    for (const row of rows) {
      const name = (row.name ?? row.Name ?? "").trim();

      const category = (
        row.category ??
        row.Category ??
        ""
      ).trim();

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

      // ===========================
      // Validate Required Fields
      // ===========================

      if (!name || !category) {
        skipped++;

        invalidRows.push({
          name: name || "Unknown Product",
          reason: "Missing required fields",
        });

        continue;
      }

      // ===========================
      // Check if Product Exists
      // ===========================

      const existing =
        await prisma.product.findFirst({
          where: {
            name: {
              equals: name,
              mode: "insensitive",
            },
          },
        });

      // ===========================
      // UPDATE Existing Product
      // ===========================

      if (existing) {
        await prisma.product.update({
          where: {
            id: existing.id,
          },

          data: {
            category,

            stock,

            stockStatus: "OPENING_STOCK",

            ...(price > 0 && {
              price,
            }),
          },
        });

        await prisma.activityLog.create({
          data: {
            action: "Updated Product",
            productName: name,
            details: "Updated through CSV import",
          },
        });

        updated++;

        continue;
      }

      // ===========================
      // CREATE New Product
      // ===========================

      const created =
        await prisma.product.create({
          data: {
            name,
            category,
            stock,
            price,
            stockStatus: "OPENING_STOCK",
          },
        });

      await prisma.activityLog.create({
        data: {
          action: "Imported Product",
          productName: created.name,
          details: "Created through CSV import",
        },
      });

      imported++;
    }

    res.json({
      success: true,

      imported,

      updated,

      skipped,

      invalidRows,

      message: `
Import Complete!

Imported: ${imported}
Updated: ${updated}
Skipped: ${skipped}
      `,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};