/*
  Warnings:

  - You are about to drop the column `is_shipped` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `shipment_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "shipment_logs" DROP CONSTRAINT "shipment_logs_shipment_id_fkey";

-- DropForeignKey
ALTER TABLE "shipment_logs" DROP CONSTRAINT "shipment_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_user_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "is_shipped";

-- DropTable
DROP TABLE "shipment_logs";

-- DropTable
DROP TABLE "shipments";
