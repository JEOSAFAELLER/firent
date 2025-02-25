
import { listarOrdem, adicionarOrdem, updateOrdem,editarOrdemPorId } from '../../backend/ordemService';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const ordem = await listarOrdem();
        return res.status(200).json(ordem);
    }

    if (req.method === 'POST') {

        const { cliente, telefone, produtos, valor } = req.body;
        console.log("recebido na api",req.body)
        if (!cliente || !telefone || !produtos || produtos.length === 0 || !valor) {
            return res.status(400).json({ message: "Dados inválidos ou incompletos!" });
          }
        

        try {
            // Adicionar a ordem e atualizar o estoque
            await adicionarOrdem(cliente, telefone, produtos, valor);

            // Resposta de sucesso
            return res.status(201).json({ message: 'Ordem de serviço criada com sucesso' });
        } catch (error) {
           
            console.error(error);
            return res.status(500).json({ message: 'Erro ao criar a ordem de serviço', error: error.message });
        }
    }

    res.status(405).json({ message: 'Método não permitido' });
}