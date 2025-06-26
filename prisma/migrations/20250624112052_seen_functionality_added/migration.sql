-- CreateTable
CREATE TABLE "SeenBiodata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeenBiodata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeenBiodata_biodataId_idx" ON "SeenBiodata"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "SeenBiodata_userId_biodataId_key" ON "SeenBiodata"("userId", "biodataId");

-- AddForeignKey
ALTER TABLE "SeenBiodata" ADD CONSTRAINT "SeenBiodata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenBiodata" ADD CONSTRAINT "SeenBiodata_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
