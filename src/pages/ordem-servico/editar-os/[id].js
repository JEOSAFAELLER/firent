import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../global.module.css'



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
  const [produtoEditando, setProdutoEditando] = useState(null);

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
        router.back();
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

  const handleVoltar = () => {
    router.back(); // Volta para a página anterior
  };
  const editarProduto = (index) => {
    const produto = produtos[index];
    setCodigoProduto(produto.produtoId);
    setNomeProduto(produto.nome);
    setQuantidade(produto.quantidade);
    setProdutoEditando(index);
  };

  if (!ordem) return <p>Carregando...</p>;


  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Editar Ordem de Serviço: {`${id}`}</h1>
      </div>
      <div className={styles.barra_pages}>

        <button className={styles.buttons} onClick={handleSubmit} style={{ color: '#f2d0a4', fontWeight: 'bolder' }} >
          <i className="fa fa-floppy-disk" style={{ fontSize: '20px', color: '#f2d0a4', marginRight: "5px" }}></i>
          Salvar
        </button>
        <div>
          <button className={styles.buttons} onClick={imprimir} >
            <i className="fa fa-print" style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}></i>
            Imprimir
          </button>


          <button className={styles.buttons} onClick={handleVoltar} >
            <i className="fa fa-arrow-left" style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}></i>
            Voltar
          </button>

        </div>

      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGridStyleCliente}>
          <div className={styles.formRowStyle} >

            <label>Cliente:</label>
            <input
              className={styles.input_os_cliente} readOnly={!ativo} type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
          </div>
          <div className={styles.formRowStyle}>
            <label>Telefone:</label>
            <input
              className={styles.input_os_cliente}
              readOnly={!ativo} type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />


          </div>
          <div className={styles.formRowStyle}>
          <label style={{marginTop:"10px"}} >
          <input
           className={styles.input_os_cliente}

            type="checkbox"
            checked={ativo}
            onChange={checkAtivo}
          />
          {ativo ? 'Ativo' : 'Ativar'}


        </label>

          </div>
         



        </div>

      

       
        <h3>Produtos</h3>

        <div className={styles.formGridStyleProduto} >
          <div className={styles.formRowStyle}>
            <label style={{marginLeft:"20px"}} htmlFor="codigoProduto">Código:</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <button disabled={!ativo} type="button" onClick={openEstoqueModal} style={{  background:"none", border:"none", padding:"0", cursor:"pointer", width:"20px",marginRight:"5px" }}>
            <i className="fa fa-magnifying-glass" style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}></i>
            </button>
            <input
            className={styles.input_os_cliente }
              readOnly={!ativo}
              type="number"
              id="codigoProduto"
              value={codigoProduto}
              onChange={(e) => setCodigoProduto(e.target.value)}
              style={{ width: "93px" }}
            />

            </div>
            
           
          </div>

          <div className={styles.formRowStyle} >
            <label htmlFor="nomeProduto">Nome:</label>
            <input
            className={styles.input_os_cliente }
              readOnly={!ativo}
              style={{ width: "400px" }}
              type="text" id="nomeProduto" value={nomeProduto} />
          </div>


          <div className={styles.formRowStyle} >
            <label htmlFor="quantidade">Quantidade:</label>
            <input
            className={styles.input_os_cliente }
              readOnly={!ativo} type="number" id="quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          </div>

          <button style={{background:"none", border:"none", padding:"0", cursor:"pointer", width:"25px", height:"25px",marginTop:"20px"}} disabled={!ativo}  type="button" onClick={adicionarProduto}>
          <i className="fa fa-circle-plus" style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}></i>
          </button>
        </div>


        <table border="1" cellPadding="7" style={{ width: '100%', borderCollapse: 'collapse', marginTop:"20px" }}>
          <thead>
            <tr>
            <th className={styles.celula} style={{width: '70%'}}>Nome</th>
              <th className={styles.celula}  style={{width: '10%'}}>Quantidade </th>
              <th className={styles.celula}  style={{width: '20%'}}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto, index) => (
              <tr key={index}>
                <td className={styles.celula}>{produto.nome}</td>
                <td className={styles.celula}>{produto.quantidade}</td>
                <td className={styles.celula}>
                  <button
                  type='button'
                   style={{ background: 'none', border: 'none', cursor: 'pointer' }} 
                   disabled={!ativo} 
                   onClick={() => {
                    editarProduto(index);
                    setProdutos(produtos.filter((_, i) => i !== index));            

                  }}><i className="fa fa-edit" style={{ fontSize: '20px', color: '#545e75' }}></i></button>
                  <button  type='button' style={{ background: 'none', border: 'none', cursor: 'pointer' }} disabled={!ativo} onClick={() => setProdutos(produtos.filter((_, i) => i !== index))}><i className="fa fa-trash" style={{ fontSize: '20px', color: '#9e2a2b' }}></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
      </form>
<div style={ValorStyle}>
<label  >Valor:</label>
        <input
        className={styles.input_os_cliente}
          readOnly={!ativo} 
          type="number" 
          value={valor} 
          onChange={(e) => setValor(e.target.value)} required />


</div>
      

     


      {estoqueModalOpen && (
        <div id="modalBackdrop" style={modalStyles} onClick={closeEstoqueModal}>
          <div style={modalContentStyles}>
            <h2>Estoque</h2>
            <button
              style={closeButtonStyles}
              onClick={() => setEstoqueModalOpen(false)}
            ><i className="fa fa-close" style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}></i></button>
            <table border="1" cellPadding="7" style={{ width: '100%' }}>
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
                      style={{background:"none", border:"none", padding:"0", cursor:"pointer", width:"25px", height:"25px"}}
                        onClick={() => {
                          setCodigoProduto(item.codigo);
                          setNomeProduto(item.nome);
                         
                          setEstoqueModalOpen(false);
                        }}
                      >
                        <i className="fa fa-square-plus" style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}></i>
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
const ValorStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '10px',
  marginBottom: '20px',
  marginTop:'20px',
  width:'50px'
};
