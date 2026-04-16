-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Incident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'reported',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "dispatchedAt" DATETIME,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Incident" ("createdAt", "description", "dispatchedAt", "id", "latitude", "longitude", "resolvedAt", "status", "title", "type", "updatedAt") SELECT "createdAt", "description", "dispatchedAt", "id", "latitude", "longitude", "resolvedAt", "status", "title", "type", "updatedAt" FROM "Incident";
DROP TABLE "Incident";
ALTER TABLE "new_Incident" RENAME TO "Incident";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
