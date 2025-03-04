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
  const [ativo, setAtivo] = useState('')

  useEffect(() => {
    if (id) {
      fetch(`/api/ordem-servico/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrdem(data);
          setCliente(data.cliente);
          setTelefone(data.telefone);
          setValor(data.valor);
          setAtivo(data.ativo)

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

  useEffect(() => {
    if (!ativo) {
      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) => ({
          ...produto,
          quantidade: 0, // Zera a quantidade de todos os produtos
        }))
      );
    }
  }, [ativo]); // 


  const fetchEstoque = async () => {
    const response = await fetch('/api/estoque');
    const data = await response.json();
    const produtosAtivos = data.filter((produto) => produto.ativo === true);

    setEstoque(produtosAtivos);
    
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

  const checkAtivo = async (event) => {
    const novoStatus = event.target.checked;
    setAtivo(novoStatus)

    console.log(ativo)
   }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!cliente || !telefone || !Array.isArray(produtos) || produtos.length === 0 || !valor) {
      alert('Preencha todos os campos obrigatórios e adicione pelo menos um produto.');
      return;
    }
  
    const updatedOrdem = {
      id: Number(id), // Garante que ID seja número
      cliente: String(cliente).trim(),
      telefone: String(telefone).trim(),
      produtos: produtos.map((produto) => ({
        ...produto,
        produtoId: Number(produto.produtoId), // Garante número
        quantidade: Number(produto.quantidade), // Garante número
      })),
      valor: Number(valor), // Garante número
      ativo: Boolean(ativo)
    };
  
    console.log('Enviando atualização:', updatedOrdem);
  
    try {
      const response = await fetch(`/api/ordem-servico/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrdem),

      });
    
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Ordem atualizada com sucesso!');
        router.push('/ordem-servico/list-os');
      } else {
        alert(`Erro ao atualizar a ordem: ${result.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      alert(`Erro ao atualizar ordem: ${error.message}`);
      console.error('Erro na requisição:', error);
    }
  };
  const imprimir = () => {
    router.push({
      pathname: '/ordem-servico/imprimir-os/imprimir-os',
      query: {
        id,
        cliente,
        telefone,
        valor,
        produtos: JSON.stringify(produtos), // Converte o array de produtos para uma string JSON
      },
    });
  }

  if (!ordem) return <p>Carregando...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Editar Ordem de Serviço: {`${id}`}</h1>
      <form onSubmit={handleSubmit}>
      
        <label style={{ marginLeft: '10px' }}>
          <input
         
            type="checkbox"
            checked={ativo}
            onChange={checkAtivo}
          />
        {ativo ? 'Ativo': 'Ativo'}  
      
        
        </label>
        <label>Cliente:</label>
        <input
        readOnly={!ativo} type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />

        <label>Telefone:</label>
        <input
        readOnly={!ativo} type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />

        <label>Valor:</label>
        <input
        readOnly={!ativo} type="number" value={valor} onChange={(e) => setValor(e.target.value)} required />

        <h3>Produtos</h3>
        <div style={formGridStyleProduto}>
          <div style={formRowStyle}>
            <label htmlFor="codigoProduto">Código:</label>
            <input
            readOnly={!ativo}
              type="number"
              id="codigoProduto"
              value={codigoProduto}
              onChange={(e) => setCodigoProduto(e.target.value)}
              style={{ width: "93px" }}
            />
            <button disabled={!ativo} type="button" onClick={openEstoqueModal} style={{ width: "100px" }}>
              🔍 Pesquisar
            </button>
          </div>

          <div style={formRowStyle}>
            <label htmlFor="nomeProduto">Nome:</label>
            <input
            readOnly={!ativo}
              style={{ width: "400px" }}
              type="text" id="nomeProduto" value={nomeProduto}  />
          </div>

          <div style={formRowStyle}>
            <label htmlFor="quantidade">Quantidade:</label>
            <input
            readOnly={!ativo} type="number" id="quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          </div>

          <button disabled={!ativo} style={{ margin: "10px" }} type="button" onClick={adicionarProduto}>
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
                  <button disabled={!ativo} onClick={() => console.log('Editar produto', produto)}>✏️</button>
                  <button disabled={!ativo} onClick={() => setProdutos(produtos.filter((_, i) => i !== index))}>🗑️</button>
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
      <button onClick={imprimir} style={{ marginTop: '20px', marginLeft: '10px' }}>
        🖨️ Imprimir
      </button>

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
