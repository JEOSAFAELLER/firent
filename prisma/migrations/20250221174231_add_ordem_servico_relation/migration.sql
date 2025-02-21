-- CreateTable
CREATE TABLE "Estoque" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Ordem_Servico" (
    "os" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,
    "estoqueId" INTEGER NOT NULL,
    CONSTRAINT "Ordem_Servico_estoqueId_fkey" FOREIGN KEY ("estoqueId") REFERENCES "Estoque" ("codigo") ON DELETE RESTRICT ON UPDATE CASCADE
);
