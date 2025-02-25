/*
  Warnings:

  - You are about to drop the column `estoqueId` on the `Ordem_Servico` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "OrdemProduto" (
    "ordemId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    PRIMARY KEY ("ordemId", "produtoId"),
    CONSTRAINT "OrdemProduto_ordemId_fkey" FOREIGN KEY ("ordemId") REFERENCES "Ordem_Servico" ("os") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdemProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Estoque" ("codigo") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ordem_Servico" (
    "os" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL
);
INSERT INTO "new_Ordem_Servico" ("cliente", "os", "produto", "quantidade", "telefone", "valor") SELECT "cliente", "os", "produto", "quantidade", "telefone", "valor" FROM "Ordem_Servico";
DROP TABLE "Ordem_Servico";
ALTER TABLE "new_Ordem_Servico" RENAME TO "Ordem_Servico";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
