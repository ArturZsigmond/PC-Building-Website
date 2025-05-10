-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "buildId" TEXT;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE SET NULL ON UPDATE CASCADE;
