/*
  Warnings:

  - You are about to drop the column `Add1` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `Add2` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `City` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `Country` on the `Address` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plusCode" TEXT,
    "add1" TEXT,
    "add2" TEXT,
    "city" TEXT NOT NULL DEFAULT 'calgary',
    "province" TEXT NOT NULL DEFAULT 'alberta',
    "postalCode" TEXT NOT NULL DEFAULT '-',
    "country" TEXT NOT NULL DEFAULT 'canada',
    "note" TEXT NOT NULL DEFAULT '-',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siteId" TEXT NOT NULL,
    CONSTRAINT "Address_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("createdAt", "id", "note", "plusCode", "postalCode", "province", "siteId", "updatedAt") SELECT "createdAt", "id", "note", "plusCode", "postalCode", "province", "siteId", "updatedAt" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE UNIQUE INDEX "Address_siteId_key" ON "Address"("siteId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
