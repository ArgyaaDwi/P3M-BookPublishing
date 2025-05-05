/*
  Warnings:

  - You are about to drop the column `current_transaction_id` on the `publication` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "publication" DROP CONSTRAINT "publication_current_transaction_id_fkey";

-- AlterTable
ALTER TABLE "publication" DROP COLUMN "current_transaction_id",
ADD COLUMN     "current_transaction_status_id" INTEGER;

-- AddForeignKey
ALTER TABLE "publication" ADD CONSTRAINT "publication_current_transaction_status_id_fkey" FOREIGN KEY ("current_transaction_status_id") REFERENCES "transaction_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
