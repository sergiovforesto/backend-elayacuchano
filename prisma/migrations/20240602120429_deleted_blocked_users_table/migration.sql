/*
  Warnings:

  - You are about to drop the `Blocked_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blocked_users" DROP CONSTRAINT "Blocked_users_userId_fkey";

-- DropTable
DROP TABLE "Blocked_users";
