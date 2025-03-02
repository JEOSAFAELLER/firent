import { getOrdem, addOrdem, atualizarOrdem, listarOrdemPorId } from "./db";

export const listarOrdem = async () => {
    return await getOrdem();
};

export const adicionarOrdem = async ( cliente, telefone, produtos, valor) => {
    return await addOrdem( cliente, telefone, produtos, valor);
};

export const updateOrdem = async (id, cliente, telefone, produtos, quantidade, valor,ativo) =>{
    
      return await atualizarOrdem(id, cliente, telefone, produtos, quantidade, valor,ativo)
}

export const editarOrdemPorId = async (id) => {
    
    return await listarOrdemPorId(id)
    
  }


