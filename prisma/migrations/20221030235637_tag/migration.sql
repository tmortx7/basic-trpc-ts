-- CreateTable
CREATE TABLE "InstrumentTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tag" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipmentId" TEXT NOT NULL,
    "instrumenttypeId" TEXT NOT NULL,
    CONSTRAINT "InstrumentTag_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InstrumentTag_instrumenttypeId_fkey" FOREIGN KEY ("instrumenttypeId") REFERENCES "InstrumentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
