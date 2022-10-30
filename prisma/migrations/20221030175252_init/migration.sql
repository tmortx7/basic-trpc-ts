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
CREATE TABLE "InstrumentType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "mvId" TEXT NOT NULL,
    "instfunctionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InstrumentType_mvId_fkey" FOREIGN KEY ("mvId") REFERENCES "MeasuredVariable" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InstrumentType_instfunctionId_fkey" FOREIGN KEY ("instfunctionId") REFERENCES "InstrumentFunction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plusCode" TEXT,
    "Add1" TEXT,
    "Add2" TEXT,
    "City" TEXT NOT NULL DEFAULT 'calgary',
    "province" TEXT NOT NULL DEFAULT 'alberta',
    "postalCode" TEXT NOT NULL DEFAULT '-',
    "Country" TEXT NOT NULL DEFAULT 'canada',
    "note" TEXT NOT NULL DEFAULT '-',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siteId" TEXT NOT NULL,
    CONSTRAINT "Address_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dept" TEXT NOT NULL,
    "deptAlias" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "site" TEXT NOT NULL,
    "siteAlias" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deptId" TEXT NOT NULL,
    CONSTRAINT "Site_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EquipmentType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipAlias" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prefix" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equiptypeId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    CONSTRAINT "Equipment_equiptypeId_fkey" FOREIGN KEY ("equiptypeId") REFERENCES "EquipmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MeasuredVariable_variable_key" ON "MeasuredVariable"("variable");

-- CreateIndex
CREATE UNIQUE INDEX "MeasuredVariable_mvalias_key" ON "MeasuredVariable"("mvalias");

-- CreateIndex
CREATE UNIQUE INDEX "Address_siteId_key" ON "Address"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_deptAlias_key" ON "Department"("deptAlias");

-- CreateIndex
CREATE UNIQUE INDEX "Site_siteAlias_key" ON "Site"("siteAlias");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentType_equipAlias_key" ON "EquipmentType"("equipAlias");
