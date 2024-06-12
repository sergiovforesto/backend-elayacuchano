/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Sessions_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sessions_users" ALTER COLUMN "lastSession" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_users_userId_key" ON "Sessions_users"("userId");
