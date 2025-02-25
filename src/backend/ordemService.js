import { getOrdem, addOrdem, atualizarOrdem, listarOrdemPorId } from "./db";

export const listarOrdem = async () => {
    return await getOrdem();
};

export const adicionarOrdem = async ( cliente, telefone, produtos, valor) => {
    return await addOrdem( cliente, telefone, produtos, valor);
};

export const updateOrdem = async (id, cliente, telefone, produto, quantidade, valor) =>{
    return await atualizarOrdem(id, cliente, telefone, produto, quantidade, valor)
}

export const editarOrdemPorId = async (id) => {
    return await listarOrdemPorId(id)
    
  }


