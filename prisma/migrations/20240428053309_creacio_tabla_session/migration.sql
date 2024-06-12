/*
  Warnings:

  - You are about to drop the `blocked_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blocked_users" DROP CONSTRAINT "blocked_users_userId_fkey";

-- DropTable
DROP TABLE "blocked_users";

-- CreateTable
CREATE TABLE "Blocked_users" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Blocked_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions_users" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "inSession" BOOLEAN NOT NULL DEFAULT false,
    "lastSession" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Sessions_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blocked_users" ADD CONSTRAINT "Blocked_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions_users" ADD CONSTRAINT "Sessions_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
