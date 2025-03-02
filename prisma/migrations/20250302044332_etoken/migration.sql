-- AlterTable
ALTER TABLE "User" ADD COLUMN     "EToken" TEXT,
ADD COLUMN     "EmailVer" BOOLEAN NOT NULL DEFAULT false;
