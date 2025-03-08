import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../global.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowsRotate, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';


export default function EditarProduto() {
  const router = useRouter();
  const { id } = router.query;  // Recebe o ID do produto da URL

  const [produto, setProduto] = useState({
    codigo:"",
    nome:  '',
    quantidade:   0,
    ativo: ''
  });

  const [produtoAtual, setProdutoAtual] = useState([]);

 
  
  const [loading, setLoading] = useState(true);
  const [ativo, setAtivo] = useState(produto.ativo)
  
  // Função para buscar o produto a ser editado
  const fetchProduto = async () => {
    if (!id) return; // Espera o id ser carregado

    const response = await fetch(`/api/estoque/${id}`);
    
    const data = await response.json();
    
    
    
    console.log(data)
    setProdutoAtual(data)
    
    setProduto(data);
    setLoading(false);
  };

  useEffect(() => {

    fetchProduto();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(produto)

    const response = await fetch(`/api/estoque/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produto),
    });

    if (response.ok) {
      alert('Produto atualizado com sucesso!');
      router.back();
    } else {
      alert('Erro ao atualizar o produto.');
    }
  };

   const checkAtivo = async (event) => {
    const novoStatus = event.target.checked;
    setProduto((prevProduto) =>({
      ...prevProduto,
      ativo:novoStatus,
    }))

    console.log(produto)
   }

  // Carregamento enquanto os dados não são carregados
  if (loading) {
    return <div>Carregando...</div>;
  }
  const handleVoltar = () => {
    router.back();
  }

  const handleRefresh = () => {
    router.reload();  // Vai forçar um refresh na página
  };


  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
      <h1>Editar Produto</h1>

      </div>
      <div className={styles.barra_pages}>
      <button  className={styles.buttons} onClick={handleSubmit} style={{color:'#f2d0a4', fontWeight:'bolder'}}>
      <FontAwesomeIcon icon={faFloppyDisk} style={{ fontSize: '20px', color: '#f2d0a4', marginRight: "5px" }}/>
          Alterar Produto
        </button>
        <button className={styles.buttons} onClick={handleRefresh} >
        <FontAwesomeIcon icon={faArrowsRotate} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}/>
          Recarregar
        </button>
        <button className={styles.buttons} onClick={handleVoltar} >
        <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}/>
          Voltar
        </button>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f4f4f4' }}>

        <p><strong>Nome atual:</strong> {produtoAtual.nome}</p>
        <p><strong>Quantidade atual:</strong> {produtoAtual.quantidade}</p>
        <p><strong>Status: </strong>{produto.ativo? 'Ativo' : 'Inativo' } </p>
        <p>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="checkbox"
            checked={produto.ativo}
            onChange={checkAtivo}
          />
        {produto.ativo ? 'Ativar': 'Ativar'}  
        
        </label>
      </p>
      </div>
      <div className={styles.formProduto}>
      <form onSubmit={handleSubmit}>
        <table className={styles.formProduto}>
        <thead>
          <tr>        
            <th className={styles.celula}>Alterar nome do produto para:</th>
            <th className={styles.celula}>Alterar quantidade para:</th>     
           
          </tr>
        </thead>
        <tbody>
          <tr>
          <td className={styles.celula}>
            <input
            className={styles.input_td}
              type="text"
              id="nome"
              value={produto.nome}
              onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
              required
            />
            </td> 
            <td className={styles.celula}>
            <input
            className={styles.input_td}
              type="number"
              id="quantidade"
              value={produto.quantidade}
              onChange={(e) => setProduto({ ...produto, quantidade: e.target.value })}
              required
            />
            </td>       
          </tr>
        </tbody>
        </table>
      

      

        

      </form>

      </div>
    

      
    </div>
  );
}
