-- CreateTable
CREATE TABLE "publication_status" (
    "id" SERIAL NOT NULL,
    "status_name" TEXT NOT NULL,
    "status_description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "publication_status_pkey" PRIMARY KEY ("id")
);
