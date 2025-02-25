-- CreateTable
CREATE TABLE "status" (
    "id" SERIAL NOT NULL,
    "status_name" TEXT NOT NULL,
    "status_descriotion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);
