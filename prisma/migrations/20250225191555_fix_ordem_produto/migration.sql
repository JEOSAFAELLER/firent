/*
  Warnings:

  - You are about to drop the column `produto` on the `Ordem_Servico` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `Ordem_Servico` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ordem_Servico" (
    "os" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "valor" INTEGER NOT NULL
);
INSERT INTO "new_Ordem_Servico" ("cliente", "os", "telefone", "valor") SELECT "cliente", "os", "telefone", "valor" FROM "Ordem_Servico";
DROP TABLE "Ordem_Servico";
ALTER TABLE "new_Ordem_Servico" RENAME TO "Ordem_Servico";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
