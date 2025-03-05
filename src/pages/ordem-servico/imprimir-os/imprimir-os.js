// pages/imprimir-os.js
import { useRouter } from 'next/router';
import styles from '../../global.module.css'
import BotaoGerarPdf from '../../componentes/botaoGerarPdf';


const ImprimirOS = () => {
  const router = useRouter();
  const { id,cliente, telefone, valor, produtos } = router.query;

  // Converte a string de produtos de volta para um array
  const produtosArray = produtos ? JSON.parse(produtos) : [];

  
  

  const handleVoltar = () => {
    router.back(); // Volta para a página anterior
  };

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Ordem de Serviço: {`${id}`}</h1>
        </div>
        <div className={styles.barra_pages}>

       <BotaoGerarPdf ordem={{ id, cliente, telefone, valor, produtos: produtosArray }} />
      
      <button className={styles.buttons}  onClick={handleVoltar} >
      <i className="fa fa-arrow-left" style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}></i>
           Voltar
        </button>


      </div>

      {/* Dados do Cliente */}
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Cliente:</strong> {cliente}</p>
        <p><strong>Telefone:</strong> {telefone}</p>
        <p><strong>Valor:</strong> R$ {valor},00</p>
      </div>

      {/* Tabela de Produtos */}
      <table border="1" cellPadding="5" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {produtosArray.map((produto, index) => (
            <tr key={index}>
              <td>{produto.nome}</td>
              <td>{produto.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
     
      {/* Estilos para impressão */}
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
};

export default ImprimirOS;