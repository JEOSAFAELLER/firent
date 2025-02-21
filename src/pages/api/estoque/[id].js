import { updateItem, listarEstoque } from '../../../backend/estoqueService';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Buscar um produto específico
    const produto = await listarEstoque(id);
    return res.status(200).json(produto);
  }

  if (req.method === 'PUT') {
    // Atualizar produto
    const { nome, quantidade } = req.body;
    const produtoAtualizado = await updateItem(id, nome, quantidade);
    return res.status(200).json(produtoAtualizado);
  }

  res.status(405).json({ message: 'Método não permitido' });
}
