/*
  Warnings:

  - You are about to drop the column `endAt` on the `roomrental` table. All the data in the column will be lost.
  - You are about to drop the column `roomName` on the `roomrental` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `roomrental` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `RoomRental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hours` to the `RoomRental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `RoomRental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `roomrental` DROP COLUMN `endAt`,
    DROP COLUMN `roomName`,
    DROP COLUMN `startAt`,
    ADD COLUMN `createdById` INTEGER NOT NULL,
    ADD COLUMN `hours` INTEGER NOT NULL,
    ADD COLUMN `roomId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `RoomRental` ADD CONSTRAINT `RoomRental_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomRental` ADD CONSTRAINT `RoomRental_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
