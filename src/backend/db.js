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

export const atualizarItem = async (id, nome, quantidade, ativo) => {
  return await prisma.estoque.update({
    where: {
      codigo: parseInt(id),
    },
    data: {
      nome,
      quantidade: parseInt(quantidade),
      ativo: ativo,
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
  return await prisma.ordem_Servico.findMany({
    include: {
      produtos: {
        include: {
          produto: true,

        }
        
      }
    }
  });
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


export const atualizarOrdem = async (id, cliente, telefone, produtos, valor, ativo) => {
  try {
    await prisma.$transaction([
      // Atualiza os dados principais da ordem de serviço
      prisma.ordem_Servico.update({
        where: { os: parseInt(id) },
        data: {
          cliente,
          telefone,
          valor,
          ativo:ativo,
        },
      }),

      // Remove os produtos antigos da ordem antes de adicionar os novos
      prisma.ordemProduto.deleteMany({
        where: { ordemId: parseInt(id) },
      }),

      // Adiciona os novos produtos à ordem de serviço
      ...produtos.map(produto => {
        return prisma.ordemProduto.create({
          data: {
            ordemId: parseInt(id),
            produtoId: produto.produtoId,
            quantidade: produto.quantidade
          }
        });
      }),

      // Atualiza o estoque com as novas quantidades
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

    return { success: true, message: "Ordem atualizada com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar ordem:", error);
    return { success: false, message: "Erro ao atualizar ordem", error };
  }
};


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

export const deleteOrdem = async (id) => {
  try {
    // Buscar os produtos da ordem antes de excluir
    const produtos = await prisma.ordemProduto.findMany({
      where: { ordemId: parseInt(id) },
    });

    await prisma.$transaction([
      // Retorna os produtos ao estoque
      ...produtos.map(produto => 
        prisma.estoque.update({
          where: { codigo: produto.produtoId },
          data: {
            quantidade: {
              increment: produto.quantidade
            }
          }
        })
      ),

      // Remove os produtos vinculados à ordem de serviço
      prisma.ordemProduto.deleteMany({
        where: { ordemId: parseInt(id) },
      }),

      // Remove a ordem de serviço
      prisma.ordem_Servico.delete({
        where: { os: parseInt(id) },
      }),
    ]);

    return { success: true, message: "Ordem excluída e estoque restaurado com sucesso!" };
  } catch (error) {
    console.error("Erro ao excluir ordem:", error);
    return { success: false, message: "Erro ao excluir ordem", error };
  }
};








