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
    try {
      const { id, cliente, telefone, produtos, valor } = req.body;
  
      if (!id || !cliente || !telefone || !Array.isArray(produtos) || produtos.length === 0 || !valor) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios e produtos devem ser uma lista válida' });
      }
  
      const ordemAtualizada = await updateOrdem(id, cliente, telefone, produtos, valor);
  console.log(ordemAtualizada)
      if (!ordemAtualizada.success) {
        return res.status(500).json({ message: 'Erro ao atualizar ordem', error: ordemAtualizada.error });
      }
  
      return res.status(200).json({ message: 'Ordem atualizada com sucesso', ordem: ordemAtualizada });
  
    } catch (error) {
      console.error('Erro ao processar atualização:', error);
      return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  }
  
  return res.status(405).json({ message: 'Método não permitido' });
  
}

