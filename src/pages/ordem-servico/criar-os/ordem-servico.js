import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CriarOrdemServico() {
  const router = useRouter();
  const [codigoProduto, setCodigoProduto] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valor, setValor] = useState('');
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [estoque, setEstoque] = useState([]);
  const [estoqueModalOpen, setEstoqueModalOpen] = useState(false);
  const [produtos, setProdutos] = useState([]);

  // Buscar estoque
  const fetchEstoque = async () => {
    const response = await fetch('/api/estoque');
    const data = await response.json();
    setEstoque(data);
  };

  // Abrir Modal
  const openEstoqueModal = () => {
    fetchEstoque();
    setEstoqueModalOpen(true);
  };

  // Fechar Modal ao clicar fora
  const closeEstoqueModal = (e) => {
    if (e.target.id === 'modalBackdrop') {
      setEstoqueModalOpen(false);
    }
  };

  // Buscar Produto pelo Código
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

  // Adicionar Produto à Lista
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

  // Enviar Ordem
  const handleSubmit = async (e) => {
    e.preventDefault();

    
      const ordem = {
        cliente,
        telefone,
        produtos: produtos.map(produto => ({
          produtoId: parseInt(produto.produtoId, 10), // Garantir que seja um número inteiro
          nome: produto.nome,
          quantidade: produto.quantidade
        })),
        valor: parseInt(valor, 10), // Garantir que valor seja um número inteiro
      };
   
    
    

    console.log("Enviando dados para a API:",JSON.stringify(ordem));

    try {
      const response = await fetch('/api/ordem-servico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordem),
        
      });

      if (response.ok) {
        alert('Ordem criada!');
        setCliente('');
        setTelefone('');
        setProdutos([]);
        setValor('');
      } else {
        alert('Erro ao cadastrar ordem');
      }
    } catch (error) {
      alert('Erro ao cadastrar ordem: ' + error.message);
    }
  };
  const handleVoltar = () => {
    router.back(); // Volta para a página anterior
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Criar Ordem de Serviço</h1>

      <form onSubmit={handleSubmit}>
        {/* Cliente e Telefone */}
        <div style={formGridStyle}>
          <div style={formRowStyle}>
            <label htmlFor="cliente">Cliente:</label>
            <input type="text" id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
          </div>
          <div style={formRowStyle}>
            <label htmlFor="telefone">Telefone:</label>
            <input type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
          </div>
        </div>

        {/* Produto */}
        <div style={formGridStyleProduto}>
          <div style={formRowStyle}>
            <label htmlFor="codigoProduto">Código:</label>
            <input
              type="number"
              id="codigoProduto"
              value={codigoProduto}
              onChange={(e) => setCodigoProduto(e.target.value)}
             style={{ width: "93px"}}
            />
            <button type="button" onClick={openEstoqueModal} style={{  width:"100px" }}>
              🔍 Pesquisar
            </button>
          </div>

          <div style={formRowStyle}>
            <label htmlFor="nomeProduto">Nome:</label>
            <input 
            style={{width: "400px"}}
            type="text" id="nomeProduto" value={nomeProduto} readOnly />
          </div>

          <div style={formRowStyle}>
            <label htmlFor="quantidade">Quantidade:</label>
            <input type="number" id="quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          </div>

          <button style={{margin:"10px"}} type="button" onClick={adicionarProduto}>
            ➕ Adicionar Produto
          </button>
        </div>

        {/* Lista de Produtos Adicionados */}
        <table border="1" cellPadding="7" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{width: '10%'}}>Código</th>
              <th style={{width: '70%'}}>Nome </th>
              <th style={{width: '20%'}}>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto, index) => (
              <tr key={index}>
                <td>{produto.produtoId}</td>
                <td>{produto.nome}</td>
                <td>{produto.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Valor */}
        <div style={ValorStyle}>
          <label htmlFor="valor">Valor:</label>
          <input type="number" id="valor" value={valor} onChange={(e) => setValor(e.target.value)} required />
        </div>

        <button type="submit" style={botaoStyle}>
          Criar Ordem de Serviço
        </button>
       
      </form>
      <button onClick={handleVoltar} style={{ padding: '10px 20px', fontSize: '16px' }}>
          ↩️ Voltar
        </button>


      {/* Modal */}
      {estoqueModalOpen && (
        <div id="modalBackdrop" style={modalStyles} onClick={closeEstoqueModal}>
          <div style={modalContentStyles}>
            <h2>Estoque</h2>
            <button
            style={closeButtonStyles}
            onClick={() => setEstoqueModalOpen(false)}>Fechar</button>
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
                          setCodigoProduto(item.codigo);
                          setNomeProduto(item.nome);
                          setEstoqueModalOpen(false);
                        }}
                      >
                        ✅
                      </button>
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

// Estilos corrigidos
const formGridStyle = { display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  columnGap: '5px',
 };
const formGridStyleProduto = { display: 'grid',
   gridTemplateColumns: '1fr 1fr 1fr 1fr ', 
   columnGap: '5px'
   };
const modalStyles = {
  position: 'fixed', // Fixa na tela
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000, // Garante que fique sobre tudo
};
const modalContentStyles = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  width: '60%',
  maxWidth: '600px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  animation: 'fadeIn 0.3s ease-in-out',
};
const botaoStyle = { padding: '10px', backgroundColor: 'green', color: 'white' };

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

const ValorStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '10px',
  marginBottom: '20px',
  marginTop:'20px',
  width:'50px'
};

const formRowStyle = {
  display: 'flex',
  flexDirection: 'column',
};