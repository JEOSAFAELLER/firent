import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../global.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft ,faCirclePlus,faClose,faEdit,faFloppyDisk,faMagnifyingGlass, faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import  ToastOK  from '../../componentes/toast/toastOK';
import  ToastError  from '../../componentes/toast/toastError';

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
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [status, setStatus] = useState('ok' | 'error')
 
 
  
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
     <p>Prencha todos os dados!</p>
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
   
    
     

 

    try {
      const response = await fetch('/api/ordem-servico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordem),
        
      });

      if (response.ok) {
       setStatus("ok")

       
        console.log('Ordem criada!');
        setCliente('');
        setTelefone('');
        setProdutos([]);
        setValor('');
        setTimeout(() => router.back(), 3000 ) 
       
      } else {
       setStatus("error")
       
        console.log('Erro ao cadastrar ordem');
        
      }
    } catch (error) {
      console.log('Erro ao cadastrar ordem: ' + error.message);
    }
    setTimeout(() => setStatus(""), 2500)
   
   
    

  };
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
 

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Criar Ordem de Serviço</h1>
      </div>
      <div className={styles.barra_pages}>
        
          <button className={styles.buttons} onClick={handleSubmit} style={{color:'#f2d0a4',fontWeight:'bolder'}} >
          <FontAwesomeIcon icon={faFloppyDisk} style={{ fontSize: '20px', color: '#f2d0a4', marginRight: "5px" }}/>
            Salvar
          </button>
        

        <button className={styles.buttons} onClick={handleVoltar} >
          <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}/>
          Voltar
        </button>
      </div>
      
      <div>

      </div>

      <form onSubmit={handleSubmit}>
        {/* Cliente e Telefone */}
        <div className={styles.formGridStyleCliente}>
          <div className={styles.formRowStyle} >
            <label htmlFor="cliente">Cliente:{!cliente && <span style={{ color: 'red', marginLeft: '10px' }}>*Campo obrigatório*</span>}</label>
            
            <input className={styles.input_os_cliente }type="text" id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
          </div>

          <div className={styles.formRowStyle} >
            <label htmlFor="telefone">Telefone: {!telefone && <span style={{ color: 'red', marginLeft: '10px' }}>*Campo obrigatório*</span>}</label>
            <input className={styles.input_os_cliente } type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
          </div>
        </div>

        {/* Produto */}
        <h3>Produtos</h3>
        <div className={styles.formGridStyleProduto} >
          <div className={styles.formRowStyle} >
            <label style={{marginLeft:"20px"}} htmlFor="codigoProduto">Código:</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <button type="button" onClick={openEstoqueModal} style={{  background:"none", border:"none", padding:"0", cursor:"pointer", width:"20px",marginRight:"5px" }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}/>
               
            </button>
            <input
            className={styles.input_os_cliente }
              type="number"
              id="codigoProduto"
              value={codigoProduto}
              onChange={(e) => setCodigoProduto(e.target.value)}
             style={{ width: "93px"}}
            />
            

            </div>
            
          </div>

          <div className={styles.formRowStyle} >
            <label htmlFor="nomeProduto">Nome:</label>
            <input 
            className={styles.input_os_cliente }
            style={{width: "400px"}}
            type="text" id="nomeProduto" value={nomeProduto} readOnly />
          </div>

          <div className={styles.formRowStyle} >
            <label htmlFor="quantidade">Quantidade:</label>
            <input  className={styles.input_os_cliente } type="number" id="quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          </div>

          <button  type="button" onClick={adicionarProduto} style={{background:"none", border:"none", padding:"0", cursor:"pointer", width:"25px", height:"25px",marginTop:"20px"}}>
          <FontAwesomeIcon icon={faCirclePlus} style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}/>
            
          </button>
        </div>

        {/* Lista de Produtos Adicionados */}
        <table border="1" cellPadding="7" style={{ width: '100%', borderCollapse: 'collapse', marginTop:"20px" }}>
          <thead>
            <tr>
              <th className={styles.celula} style={{width: '10%'}}>Código</th>
              <th className={styles.celula}  style={{width: '50%'}}>Nome </th>
              <th className={styles.celula}  style={{width: '20%'}}>Quantidade</th>
              <th className={styles.celula}  style={{width: '20%'}}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto, index) => (
              <tr key={index}>
                <td className={styles.celula} >{produto.produtoId}</td>
                <td className={styles.celula} >{produto.nome}</td>
                <td className={styles.celula} >{produto.quantidade}</td>
                <td className={styles.celula}>
                  <button
                  type='button'
                   style={{ background: 'none', border: 'none', cursor: 'pointer' }} 
                  
                   onClick={() => {
                    editarProduto(index);
                    setProdutos(produtos.filter((_, i) => i !== index));            

                  }}><FontAwesomeIcon icon={faEdit} style={{ fontSize: '20px', color: '#545e75' }}/></button>
                  <button  type='button' style={{ background: 'none', border: 'none', cursor: 'pointer' }}  onClick={() => setProdutos(produtos.filter((_, i) => i !== index))}><i className="fa fa-trash" style={{ fontSize: '20px', color: '#9e2a2b' }}></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Valor */}
        <div style={ValorStyle}>
          <label htmlFor="valor">Valor: {!valor && <span style={{ color: 'red', marginLeft: '10px' }}>*Campo obrigatório*</span>}</label>
          <input className={styles.input_os_cliente } 
          placeholder="R$ 0,00"
          type="text" 
          id="valor" 
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          
         
          required />
        </div>

    
       
      </form>
    


      {/* Modal */}
      {estoqueModalOpen && (
        <div id="modalBackdrop" style={modalStyles} onClick={closeEstoqueModal}>
          <div style={modalContentStyles}>
            <h2>Estoque</h2>
            <button
            style={closeButtonStyles}
            onClick={() => setEstoqueModalOpen(false)}>
               <FontAwesomeIcon icon={faClose} style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}/>
              </button>
            <table border="2" cellPadding="7" style={{ width: '100%' }}>
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
                        <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}/>
                        
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
     
      {status === "ok" && <ToastOK />}
      {status === "error" && <ToastError />}
    </div>
  );
}

// Estilos corrigidos

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

