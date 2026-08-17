-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('OPENING_STOCK', 'WAITING_FOR_RESTOCK', 'ACTIVE');

-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "details" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stockStatus" "StockStatus" NOT NULL DEFAULT 'ACTIVE';
