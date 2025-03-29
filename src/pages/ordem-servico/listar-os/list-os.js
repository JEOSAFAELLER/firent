import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../global.module.css'
import gerarPdf from '../../componentes/gerarPdf';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight,faCircleArrowLeft,faArrowLeft, faEdit, faFilePdf, faPlus, faPrint } from '@fortawesome/free-solid-svg-icons';
import  ToastAlert from '../../componentes/toast/toastAlert';
const Ordens = () => {
  const [ordens, setOrdens] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const router = useRouter();

  const itensPorPagina = 20;
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const produtosPaginados = ordens.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(ordens.length / itensPorPagina);

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };


  // Função para buscar as ordens de serviço da API
  const fetchOrdens = async () => {
    const response = await fetch('/api/ordem-servico');  // Sua rota para listar ordens
    const data = await response.json();
    setOrdens(data);
    
  };

  useEffect(() => {
    fetchOrdens();
  }, []);

 

  // Função para redirecionar para a página de criar nova ordem
  const handleCreate = () => {
    router.push('/ordem-servico/criar-os/ordem-servico');
  };
  const handleVoltar = () => {
    router.back(); // Volta para a página anterior
  };
 
  const imprimir = (ordem) => {
    
    router.push({
      pathname: '/ordem-servico/imprimir-os/imprimir-os',
      query: {
       id:ordem.os,
        cliente: ordem.cliente,
        telefone:ordem.telefone,
        valor:ordem.valor,
        produtos:  JSON.stringify(
          ordem.produtos.map((p) =>({
            nome:p.produto.nome,
            quantidade:p.quantidade,
          }))
        )
      },
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
      <h1>Lista de Ordens de Serviço</h1>
      </div>
      {toastType === "success" &&   <ToastAlert message={toastMessage} />}
     
      <div className={styles.barra_pages}>
      <button
      className={styles.buttons}
        onClick={handleCreate}
      
      >
        <FontAwesomeIcon icon={faPlus} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}/>
        Criar Nova Ordem
      </button>
      <div>
      <button id="gerarPdf" className={styles.buttons} onClick={()=> gerarPdf(ordens, setToastMessage, setToastType)}>
       <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}/>
       Exportar
     </button>
       
     
     
      <button 
      className={styles.buttons}      
      onClick={handleVoltar} >
        <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}/>
        
           Voltar
        </button>

      </div>
     
      </div>
      
    
      <table border="1" cellPadding="7" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th className={styles.celula}>O.S.</th>
            <th className={styles.celula}>Cliente</th>
            <th className={styles.celula}>Telefone</th>           
            <th className={styles.celula}>Valor</th>
            <th className={styles.celula}>Status</th>
            <th id='editar_th' className={styles.celula}>Editar</th>
          </tr>
        </thead>
        <tbody>
          {produtosPaginados.map((ordem) => (
            <tr className={!ordem.ativo ? styles.linhaInativa : ''} key={ordem.os}>
              <td className={styles.celula}>{ordem.os}</td>
              <td className={styles.celula}>{ordem.cliente}</td>
              <td className={styles.celula}>{ordem.telefone}</td>             
              <td className={styles.celula}>R$ {ordem.valor},00</td>
              
                <td className={styles.celula}>{ordem.ativo ? "Ativo" : "Inativo"}</td>
                <td id='editar_td' className={styles.celula}>
                  <Link href={`/ordem-servico/editar-os/${ordem.os}`}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <FontAwesomeIcon icon={faEdit} style={{ fontSize: '20px', color: '#545e75' }}/>
                    </button>
                  </Link>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}  onClick={()=>imprimir(ordem)} >
            <FontAwesomeIcon icon={faPrint} style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}/>
            
          </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.titulo} style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', padding:'7px'  }}>
  <button onClick={paginaAnterior} disabled={paginaAtual === 1} className={styles.botaoPaginacao} style={{ cursor: paginaAtual === 1 ? "not-allowed" : "pointer" }}>
    Anterior
    <FontAwesomeIcon icon={faCircleArrowLeft} style={{ fontSize: '20px',  marginLeft: "5px" }} />
  </button>
  <span style={{ margin: '0 10px' }}>
    Página {paginaAtual} de {totalPaginas}
  </span>
  <button onClick={proximaPagina} disabled={paginaAtual === totalPaginas} className={styles.botaoPaginacao} style={{ cursor: paginaAtual === 1 ? "not-allowed" : "pointer" }} >
  <FontAwesomeIcon icon={faCircleArrowRight} style={{ fontSize: '20px',  marginRight: "5px" }} />
    Próxima
  </button>
</div>


      <style jsx>{`
        @media print {
          /* Oculta o botão de imprimir na impressão */
          .buttons,
          button,
          i,
          #editar_th,
          #editar_td{                    
            display: none;!important;
          }           
   

          /* Ajusta o layout para impressão */
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};


export default Ordens;
