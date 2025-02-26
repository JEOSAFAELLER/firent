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

export const listarProdutoPorId = async (id) => {
  return await prisma.estoque.findUnique({
    where: { codigo: parseInt(id) },
  });


}

//ordem-serviço

export const getOrdem = async () => {
  return await prisma.ordem_Servico.findMany();
};

export const addOrdem = async (cliente, telefone, produtos, valor) => {
  try {
    await prisma.$transaction([
      ...produtos.map(produto => {
        return prisma.ordem_Servico.create({
          data: {
            cliente,
            telefone,
            valor,
            produtos: {
              create: {
                produtoId: produto.produtoId,
                quantidade: produto.quantidade
              }
            }
          }
        });
      }),
      ...produtos.map(produto => {
        return prisma.estoque.update({
          where: { codigo: produto.produtoId },
          data: {
            quantidade: {
              decrement: produto.quantidade
            }
          }
        });
      })
    ]);
  } catch (error) {
    console.error(error);
    console.log(error)
  }
};


export const atualizarOrdem = async (id, cliente, telefone, produto, quantidade, valor) => {
  return await prisma.ordem_Servico.update({
    where: {
      os: parseInt(id),
    },
    data: {
      cliente,
      telefone,
      produto,
      quantidade: parseInt(quantidade),
      valor

    },
  });
}

export const listarOrdemPorId = async (id) => {
  return await prisma.ordem_Servico.findUnique({
    where: { os: parseInt(id) },
    include: {
      produtos: {
        include: {
          produto: true,

        }
        
      }
    }


  });


}






