import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function EditarOrdemServico() {
  const router = useRouter();
  const { id } = router.query;
  const [ordem, setOrdem] = useState(null);
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [valor, setValor] = useState('');
  const [estoque, setEstoque] = useState([]);
  const [estoqueModalOpen, setEstoqueModalOpen] = useState(false);
  const [codigoProduto, setCodigoProduto] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    if (id) {
      fetch(`/api/ordem-servico/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrdem(data);
          setCliente(data.cliente);
          setTelefone(data.telefone);
          setValor(data.valor);

          // Ajustando a estrutura para armazenar os produtos corretamente
          if (data.produtos) {
            setProdutos(data.produtos.map((p) => ({
              produtoId: p.produtoId,
              nome: p.produto.nome, // Acessando o nome dentro do objeto produto
              quantidade: p.quantidade
            })));
          }
        })
        .catch((error) => console.error('Erro ao buscar ordem:', error));
    }
  }, [id]);


  const fetchEstoque = async () => {
    const response = await fetch('/api/estoque');
    const data = await response.json();
    setEstoque(data);
  };

  const openEstoqueModal = () => {
    fetchEstoque();
    setEstoqueModalOpen(true);
  };

  const closeEstoqueModal = (e) => {
    if (e.target.id === 'modalBackdrop') {
      setEstoqueModalOpen(false);
    }
  };
  const buscarProduto = async () => {
    if (codigoProduto) {
      const response = await fetch(`/api/estoque/${codigoProduto}`);
      const data = await response.json();

      if (data) {
        setNomeProduto(data.nome);
      } else {
        setNomeProduto('');
      }
    }
  };

  useEffect(() => {
    buscarProduto();
  }, [codigoProduto]);

  const adicionarProduto = () => {
    if (!codigoProduto || !nomeProduto || quantidade <= 0) {
      alert('Preencha os campos corretamente.');
      return;
    }

    setProdutos([...produtos, { produtoId: codigoProduto, nome: nomeProduto, quantidade }]);
    setCodigoProduto('');
    setNomeProduto('');
    setQuantidade(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedOrdem = { cliente, telefone, produtos, valor };


    try {
      const response = await fetch(`/api/ordem-servico/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrdem),
      });

      if (response.ok) {
        alert('Ordem atualizada com sucesso!');
        router.push('/ordem-servico/list-os');
      } else {
        alert('Erro ao atualizar a ordem');
      }
    } catch (error) {
      alert('Erro ao atualizar ordem: ' + error.message);
    }
  };

  if (!ordem) return <p>Carregando...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Editar Ordem de Serviço</h1>
      <form onSubmit={handleSubmit}>
        <label>Cliente:</label>
        <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />

        <label>Telefone:</label>
        <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />

        <label>Valor:</label>
        <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} required />

        <h3>Produtos</h3>
        <div style={formGridStyleProduto}>
          <div style={formRowStyle}>
            <label htmlFor="codigoProduto">Código:</label>
            <input
              type="number"
              id="codigoProduto"
              value={codigoProduto}
              onChange={(e) => setCodigoProduto(e.target.value)}
              style={{ width: "93px" }}
            />
            <button type="button" onClick={openEstoqueModal} style={{ width: "100px" }}>
              🔍 Pesquisar
            </button>
          </div>

          <div style={formRowStyle}>
            <label htmlFor="nomeProduto">Nome:</label>
            <input
              style={{ width: "400px" }}
              type="text" id="nomeProduto" value={nomeProduto} readOnly />
          </div>

          <div style={formRowStyle}>
            <label htmlFor="quantidade">Quantidade:</label>
            <input type="number" id="quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          </div>

          <button style={{ margin: "10px" }} type="button" onClick={adicionarProduto}>
            ➕ Adicionar Produto
          </button>
        </div>


        <table border="1" cellPadding="5" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto, index) => (
              <tr key={index}>
                <td>{produto.nome}</td>
                <td>{produto.quantidade}</td>
                <td>
                  <button onClick={() => console.log('Editar produto', produto)}>✏️</button>
                  <button onClick={() => setProdutos(produtos.filter((_, i) => i !== index))}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit">Salvar Alterações</button>
      </form>
      
      <Link href="/ordem-servico/list-os">
        <button style={{ marginTop: '20px' }}>Voltar</button>
      </Link>

      {estoqueModalOpen && (
        <div id="modalBackdrop" style={modalStyles} onClick={closeEstoqueModal}>
          <div style={modalContentStyles}>
            <h2>Estoque</h2>
            <button
              style={closeButtonStyles}
              onClick={() => setEstoqueModalOpen(false)}
            >Fechar</button>
            <table border="1" cellPadding="5" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Quantidade</th>
                  <th>Selecionar</th>
                </tr>
              </thead>
              <tbody>
                {estoque.map((item) => (
                  <tr key={item.codigo}>
                    <td>{item.codigo}</td>
                    <td>{item.nome}</td>
                    <td>{item.quantidade}</td>
                    <td>
                      <button
                        onClick={() => {
                          setProdutos([...produtos, { produtoId: item.codigo, nome: item.nome, quantidade: 1 }]);
                          setEstoqueModalOpen(false);
                        }}
                      >✅</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '5px',
};
const formGridStyleProduto = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr ',
  columnGap: '5px'
};

const formRowStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyles = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  width: '60%',
  maxWidth: '600px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  position: 'relative',
};

const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  fontSize: '18px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#333',
};
