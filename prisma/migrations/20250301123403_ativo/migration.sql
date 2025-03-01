-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Estoque" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Estoque" ("codigo", "createdAt", "nome", "quantidade") SELECT "codigo", "createdAt", "nome", "quantidade" FROM "Estoque";
DROP TABLE "Estoque";
ALTER TABLE "new_Estoque" RENAME TO "Estoque";
CREATE TABLE "new_Ordem_Servico" (
    "os" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Ordem_Servico" ("cliente", "os", "telefone", "valor") SELECT "cliente", "os", "telefone", "valor" FROM "Ordem_Servico";
DROP TABLE "Ordem_Servico";
ALTER TABLE "new_Ordem_Servico" RENAME TO "Ordem_Servico";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
