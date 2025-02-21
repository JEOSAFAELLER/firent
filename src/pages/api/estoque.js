import { NextApiRequest, NextApiResponse } from 'next';
import { listarEstoque, adicionarItem } from '../../backend/estoqueService';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const estoque = await listarEstoque();
        return res.status(200).json(estoque);
    }

    if (req.method === 'POST') {
        const { nome, quantidade } = req.body;
console.log(req.body)
        if (!nome || !quantidade) {
            return res.status(400).json({ message: 'Nome e quantidade são obrigatórios' });
          }
        const novoItem = await adicionarItem(nome, quantidade);
        return res.status(201).json(novoItem);
    }

    res.status(405).json({ message: 'Método não permitido' });
}
