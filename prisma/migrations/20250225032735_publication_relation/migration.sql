/*
  Warnings:

  - A unique constraint covering the columns `[status_name]` on the table `publication_status` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[status_description]` on the table `publication_status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "publication" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "publisher_id" INTEGER,
    "publication_ticket" TEXT NOT NULL,
    "publication_title" TEXT NOT NULL,
    "publication_document" TEXT NOT NULL,
    "current_status_id" INTEGER NOT NULL,
    "supporting_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_activities" (
    "id" SERIAL NOT NULL,
    "publication_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "publication_status_id" INTEGER NOT NULL,
    "publication_notes" TEXT,
    "supporting_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "publication_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "publication_status_status_name_key" ON "publication_status"("status_name");

-- CreateIndex
CREATE UNIQUE INDEX "publication_status_status_description_key" ON "publication_status"("status_description");

-- AddForeignKey
ALTER TABLE "publication" ADD CONSTRAINT "publication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication" ADD CONSTRAINT "publication_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication" ADD CONSTRAINT "publication_current_status_id_fkey" FOREIGN KEY ("current_status_id") REFERENCES "publication_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_activities" ADD CONSTRAINT "publication_activities_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_activities" ADD CONSTRAINT "publication_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_activities" ADD CONSTRAINT "publication_activities_publication_status_id_fkey" FOREIGN KEY ("publication_status_id") REFERENCES "publication_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
