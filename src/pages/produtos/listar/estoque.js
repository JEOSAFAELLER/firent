// src/pages/estoque.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../global.module.css'

export default function Estoque() {
  const router = useRouter();
  const [estoque, setEstoque] = useState([]);

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

  const handleImprimir = () => {
    window.print();
  };
  const handleVoltar = () => {
    router.back(); // Volta para a página anterior
  };

  return (
    <div className={styles.container} >
      <div className={styles.titulo}>
        <h1>Estoque Geral</h1>

      </div>
      <div className={styles.barra_pages} >

        <Link href="/produtos/cadastrar/cadastro-produto">
          <button className={styles.buttons} >
          <i className="fa fa-plus" style={{ fontSize: '20px', color: '#f7f7ff', marginRight:"5px" }}></i>
            Cadastrar Novo Produto
          </button>
        </Link>
        <div>
          <button className={styles.buttons} onClick={handleImprimir} >
          <i className="fa fa-print" style={{ fontSize: '20px', color: '#f7f7ff', marginRight:"5px" }}></i>
           Imprimir
          </button>


          <button className={styles.buttons} onClick={handleVoltar} style={{ justifySelf: 'flex-end' }} >
          <i className="fa fa-arrow-left" style={{ fontSize: '20px', color: '#f7f7ff', marginRight:"5px" }}></i>
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
            <th className={styles.celula}>Ação</th>
            <th className={styles.celula}>Ativo?</th>
          </tr>
        </thead>
        <tbody>
          {estoque.length > 0 ? (
            estoque.map((produto) => (
              <tr key={produto.codigo}>
                <td className={styles.celula } >{produto.codigo}</td>
                <td className={styles.celula } >{produto.nome}</td >
                <td className={styles.celula } >{produto.quantidade}</td >
                <td className={styles.celula } >
                  <Link href={`/produtos/editar/${produto.codigo}`}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      
                      <i className="fa fa-edit" style={{ fontSize: '20px', color: '#545e75' }}></i>
                    </button>
                  </Link>


                </td>
                <td className={styles.celula } >{produto.ativo ? 'ativo' : 'Inativo'}</td>
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

      <style jsx>{`
        @media print {
          /* Oculta o botão de imprimir na impressão */
          button {
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
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
