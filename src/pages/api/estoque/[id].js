import { updateItem, editarProdutoPorId, deletarProduto, atualizarStatus  } from '../../../backend/estoqueService';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const produto = await editarProdutoPorId(id);

      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      return res.status(200).json(produto);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar produto' });
    }
  }



  if (req.method === 'PUT') {
    // Atualizar produto
    const { nome, quantidade, ativo } = req.body;
    const produtoAtualizado = await updateItem(id, nome, quantidade, ativo);
    return res.status(200).json(produtoAtualizado);
  }

 
  if (req.method === 'DELETE') {
    
            try {
              
                if (!id) {
                    return res.status(400).json({ message: 'ID do produto é obrigatório' });
                }
    
                const result = await deletarProduto(id);
    
                if (result.success) {
                    return res.status(200).json({ message: "Produto deletado com sucesso!" });
                } else {
                    return res.status(500).json({ message: result.message, error: result.error });
                }
            } catch (error) {
                console.error("Erro ao deletar ordem:", error);
                return res.status(500).json({ message: "Erro interno no servidor", error });
            }
        }

  res.status(405).json({ message: 'Método não permitido' });
}


