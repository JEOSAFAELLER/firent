import { updateOrdem, editarOrdemPorId } from '../../../backend/ordemService';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ message: 'ID não fornecido' });
  }

  if (req.method === 'GET') {
    try {
      const os = await editarOrdemPorId(id);

      if (!os) {
        return res.status(404).json({ message: 'Ordem não encontrado' });
      }

      return res.status(200).json(os);
    } catch (error) {
        console.log(error)
      return res.status(500).json({ message: 'Erro ao buscar ordem', error: error.message });
    }
  }



  if (req.method === 'PUT') {
    // Atualizar produto
    const { nome, quantidade } = req.body;
    const produtoAtualizado = await updateOrdem(id, nome, quantidade);
    return res.status(200).json(produtoAtualizado);
  }

  res.status(405).json({ message: 'Método não permitido' });
}

