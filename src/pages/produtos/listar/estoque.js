// src/pages/estoque.js

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../global.module.css'
import gerarPdf from "../../componentes/gerarPdf"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight,faCircleArrowLeft,faArrowLeft, faEdit, faFilePdf, faPlus } from '@fortawesome/free-solid-svg-icons';
import ToastAlert from '../../componentes/toast/toastAlert';



export default function Estoque() {
  const router = useRouter();
  const [estoque, setEstoque] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);


  const itensPorPagina = 20;
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const produtosPaginados = estoque.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(estoque.length / itensPorPagina);

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };




  // Função para buscar o estoque
  const fetchEstoque = async () => {
    const response = await fetch('/api/estoque');
    const data = await response.json();
    setEstoque(data);
  };
  console.log(estoque)



  useEffect(() => {

    fetchEstoque();
  }, []);


  const handleVoltar = () => {
    router.back(); // Volta para a página anterior
  };

  return (
    <div className={styles.container} >
      <div className={styles.titulo}>
        <h1>Estoque Geral</h1>

      </div>
      {toastType === "success" && <ToastAlert message={toastMessage} />}
      <div className={styles.barra_pages} >

        <Link href="/produtos/cadastrar/cadastro-produto">
          <button className={styles.buttons} >
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }} />
            Cadastrar Novo Produto
          </button>
        </Link>
        <div>
          <button id="gerarPdf" className={styles.buttons} onClick={() => gerarPdf(estoque, setToastMessage, setToastType)}>
            <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }} />
            Exportar
          </button>


          <button className={styles.buttons} onClick={handleVoltar} style={{ justifySelf: 'flex-end' }} >
            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }} />
            Voltar
          </button>

        </div>





      </div>



      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th className={styles.celula}>Código</th>
            <th className={styles.celula}>Nome do Produto</th>
            <th className={styles.celula}>Quantidade</th>
            <th className={styles.celula}>Status</th>
            <th id='editar_th' className={styles.celula}>Editar</th>
          </tr>
        </thead>
        <tbody>
          {estoque.length > 0 ? (
            produtosPaginados.map((produto) => (
              <tr className={!produto.ativo ? styles.linhaInativa : ''} key={produto.codigo}>
                <td className={styles.celula} >{produto.codigo}</td>
                <td className={styles.celula} >{produto.nome}</td >
                <td className={styles.celula} >{produto.quantidade}</td >

                <td className={styles.celula} >{produto.ativo ? 'ativo' : 'Inativo'}</td>
                <td id='editar_td' className={styles.celula} >
                  <Link href={`/produtos/editar/${produto.codigo}`}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>

                      <FontAwesomeIcon icon={faEdit} style={{ fontSize: '20px', color: '#545e75' }} />
                    </button>
                  </Link>


                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>
                Nenhum produto encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.titulo} style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', padding:'7px'  }}>
  <button onClick={paginaAnterior} disabled={paginaAtual === 1} className={styles.botaoPaginacao}>
  <FontAwesomeIcon icon={faCircleArrowLeft} style={{ fontSize: '20px',  marginRight: "5px" }} />
    Anterior
  </button>
  <span style={{ margin: '0 10px' }}>
    Página {paginaAtual} de {totalPaginas}
  </span>
  <button onClick={proximaPagina} disabled={paginaAtual === totalPaginas} className={styles.botaoPaginacao} >
  <FontAwesomeIcon icon={faCircleArrowRight} style={{ fontSize: '20px',  marginRight: "5px" }} />
    Próxima
  </button>
</div>



      <style jsx>{`
        @media print {
          /* Oculta o botão de imprimir na impressão */
           button,
          #editar_th,
          #editar_td{                    
            display: none;
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
}
