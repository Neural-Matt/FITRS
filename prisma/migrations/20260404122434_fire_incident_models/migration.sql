/*
  Warnings:

  - The primary key for the `Incident` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lat` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `Incident` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "currentLat" REAL NOT NULL,
    "currentLng" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "incidentId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Assignment_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Assignment_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Incident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'reported',
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Incident" ("createdAt", "description", "id", "status", "title", "updatedAt") SELECT "createdAt", "description", "id", "status", "title", "updatedAt" FROM "Incident";
DROP TABLE "Incident";
ALTER TABLE "new_Incident" RENAME TO "Incident";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_incidentId_unitId_key" ON "Assignment"("incidentId", "unitId");
