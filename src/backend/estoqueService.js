import { getEstoque, addItem, atualizarItem, listarProdutoPorId, atualizarStatusItem} from './db';

export const listarEstoque = async () => {
    return await getEstoque();
};

export const adicionarItem = async (nome, quantidade) => {
    return await addItem(nome, quantidade);
};

export const updateItem = async (id, nome, quantidade, ativo) =>{
    return await atualizarItem(id,nome, quantidade, ativo)
}

export const editarProdutoPorId = async (id) => {
    return await listarProdutoPorId(id)
    
  }

  







