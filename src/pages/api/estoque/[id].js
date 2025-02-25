import { updateItem, editarProdutoPorId } from '../../../backend/estoqueService';

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
    const { nome, quantidade } = req.body;
    const produtoAtualizado = await updateItem(id, nome, quantidade);
    return res.status(200).json(produtoAtualizado);
  }

  res.status(405).json({ message: 'Método não permitido' });
}

