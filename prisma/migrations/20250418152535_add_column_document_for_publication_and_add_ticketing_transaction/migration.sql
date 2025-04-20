-- AlterTable
ALTER TABLE "publication" ADD COLUMN     "publication_authenticity_proof" TEXT,
ADD COLUMN     "publication_book_cover" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transaction_ticket" TEXT;
