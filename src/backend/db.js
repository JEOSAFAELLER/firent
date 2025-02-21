import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getEstoque = async () => {
    return await prisma.estoque.findMany();
};

export const addItem = async (nome, quantidade) => {
    return await prisma.estoque.create({
        data: { nome, quantidade },
    });
};

export const atualizarItem = async (id, nome, quantidade) => {
    return await prisma.estoque.update({
      where: {
        codigo: parseInt(id),
      },
      data: {
        nome,
        quantidade: parseInt(quantidade),
      },
    });
}


