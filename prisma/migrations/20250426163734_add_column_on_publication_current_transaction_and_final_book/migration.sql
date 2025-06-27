/*
  Warnings:

  - You are about to drop the column `supporting_url` on the `publication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "publication" DROP COLUMN "supporting_url",
ADD COLUMN     "current_transaction_id" INTEGER,
ADD COLUMN     "publication_final_book" TEXT;

-- AddForeignKey
ALTER TABLE "publication" ADD CONSTRAINT "publication_current_transaction_id_fkey" FOREIGN KEY ("current_transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
