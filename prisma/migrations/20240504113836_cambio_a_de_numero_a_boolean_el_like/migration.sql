/*
  Warnings:

  - The `like` column on the `Likes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "like",
ADD COLUMN     "like" BOOLEAN DEFAULT false;
