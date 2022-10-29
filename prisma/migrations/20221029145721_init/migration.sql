/*
  Warnings:

  - The primary key for the `InstrumentISA` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `InstrumentISA` table. All the data in the column will be lost.
  - The required column `id` was added to the `InstrumentISA` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InstrumentISA" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "mvId" TEXT NOT NULL,
    "instfunctionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InstrumentISA_mvId_fkey" FOREIGN KEY ("mvId") REFERENCES "MeasuredVariable" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InstrumentISA_instfunctionId_fkey" FOREIGN KEY ("instfunctionId") REFERENCES "InstrumentFunction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InstrumentISA" ("createdAt", "description", "instfunctionId", "mvId", "updatedAt") SELECT "createdAt", "description", "instfunctionId", "mvId", "updatedAt" FROM "InstrumentISA";
DROP TABLE "InstrumentISA";
ALTER TABLE "new_InstrumentISA" RENAME TO "InstrumentISA";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
