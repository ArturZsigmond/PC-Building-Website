/*
  Warnings:

  - The primary key for the `Build` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MonitoredUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_userId_fkey";

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_userId_fkey";

-- DropForeignKey
ALTER TABLE "MonitoredUser" DROP CONSTRAINT "MonitoredUser_userId_fkey";

-- AlterTable
ALTER TABLE "Build" DROP CONSTRAINT "Build_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Build_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Build_id_seq";

-- AlterTable
ALTER TABLE "Log" DROP CONSTRAINT "Log_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Log_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Log_id_seq";

-- AlterTable
ALTER TABLE "MonitoredUser" DROP CONSTRAINT "MonitoredUser_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MonitoredUser_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MonitoredUser_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitoredUser" ADD CONSTRAINT "MonitoredUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
