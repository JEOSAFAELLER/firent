import { getEstoque, addItem, atualizarItem, listarProdutoPorId } from './db';

export const listarEstoque = async () => {
    return await getEstoque();
};

export const adicionarItem = async (nome, quantidade) => {
    return await addItem(nome, quantidade);
};

export const updateItem = async (id, nome, quantidade) =>{
    return await atualizarItem(id,nome, quantidade)
}

export const editarProdutoPorId = async (id) => {
    return await listarProdutoPorId(id)
    
  }



