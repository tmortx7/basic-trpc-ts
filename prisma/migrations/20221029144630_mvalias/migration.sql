-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MeasuredVariable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variable" TEXT NOT NULL,
    "mvalias" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "InstrumentFunction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instrumentfunction" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "InstrumentISA" (
    "uid" TEXT NOT NULL,
    "mvId" TEXT NOT NULL,
    "instfunctionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("mvId", "instfunctionId"),
    CONSTRAINT "InstrumentISA_mvId_fkey" FOREIGN KEY ("mvId") REFERENCES "MeasuredVariable" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InstrumentISA_instfunctionId_fkey" FOREIGN KEY ("instfunctionId") REFERENCES "InstrumentFunction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MeasuredVariable_variable_key" ON "MeasuredVariable"("variable");

-- CreateIndex
CREATE UNIQUE INDEX "MeasuredVariable_mvalias_key" ON "MeasuredVariable"("mvalias");
