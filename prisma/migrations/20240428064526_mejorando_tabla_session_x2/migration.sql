/*
  Warnings:

  - You are about to drop the column `lastSession` on the `Sessions_users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sessions_users" DROP COLUMN "lastSession",
ALTER COLUMN "isActive" DROP DEFAULT,
ALTER COLUMN "inSession" DROP DEFAULT;
