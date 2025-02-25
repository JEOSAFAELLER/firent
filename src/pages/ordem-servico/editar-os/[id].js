import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditarOrdem = () => {
  const router = useRouter();
  const { id } = router.query;
  const [ordem, setOrdem] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/ordem-servico/${id}`)
        .then((response) => response.json())
        .then((data) => setOrdem(data))
        .catch((error) => console.error('Erro ao buscar ordem:', error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/ordem-servico/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ordem),
    });

    if (response.ok) {
      alert('Ordem de serviço atualizada com sucesso!');
      router.push('/ordem-servico');
    } else {
      alert('Erro ao atualizar ordem de serviço');
    }
  };

  if (!ordem) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Editar Ordem de Serviço</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cliente:</label>
          <input
            type="text"
            value={ordem.cliente}
            onChange={(e) => setOrdem({ ...ordem, cliente: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Telefone:</label>
          <input
            type="text"
            value={ordem.telefone}
            onChange={(e) => setOrdem({ ...ordem, telefone: e.target.value })}
            required
          />
        </div>
        {/* Campos para produtos e valores */}
        <h3>Produtos</h3>
        {ordem.produtos.map((produto, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div>
              <label>Produto ID:</label>
              <input
                type="number"
                value={produto.produtoId}
                onChange={(e) =>
                  handleProdutoChange(index, 'produtoId', e.target.value)
                }
                required
              />
            </div>
            <div>
              <label>Quantidade:</label>
              <input
                type="number"
                value={produto.quantidade}
                onChange={(e) =>
                  handleProdutoChange(index, 'quantidade', e.target.value)
                }
                required
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddProduto}>
          Adicionar Produto
        </button>

        {/* Campo para editar o valor total */}
        <div style={{ marginTop: '20px' }}>
          <label>Valor Total:</label>
          <input
            type="number"
            value={ordem.valor}
            onChange={(e) => setOrdem({ ...ordem, valor: e.target.value })}
            required
          />
        </div>

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditarOrdem;
