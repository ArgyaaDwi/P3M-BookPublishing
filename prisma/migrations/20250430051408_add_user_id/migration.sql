-- AlterTable
ALTER TABLE "shipment_logs" ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "shipments" ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_logs" ADD CONSTRAINT "shipment_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
