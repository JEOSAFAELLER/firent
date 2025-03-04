import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../global.module.css'
const Ordens = () => {
  const [ordens, setOrdens] = useState([]);
  const router = useRouter();

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
  const handleImprimir = () => {
    window.print();
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
      <div className={styles.barra_pages}>
      <button
      className={styles.buttons}
        onClick={handleCreate}
      
      >
        <i className="fa fa-plus" style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}></i>
        Criar Nova Ordem
      </button>
      <div>
      <button className={styles.buttons} onClick={handleImprimir} >
            <i className="fa fa-print" style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}></i>
            Imprimir
          </button>
      <button 
      className={styles.buttons}      
      onClick={handleVoltar} >
        <i className="fa fa-arrow-left" style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}></i>
        
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
          {ordens.map((ordem) => (
            <tr className={!ordem.ativo ? styles.linhaInativa : ''} key={ordem.os}>
              <td className={styles.celula}>{ordem.os}</td>
              <td className={styles.celula}>{ordem.cliente}</td>
              <td className={styles.celula}>{ordem.telefone}</td>             
              <td className={styles.celula}>R$ {ordem.valor},00</td>
              
                <td className={styles.celula}>{ordem.ativo ? "Ativo" : "Inativo"}</td>
                <td id='editar_td' className={styles.celula}>
                  <Link href={`/ordem-servico/editar-os/${ordem.os}`}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <i className="fa fa-edit" style={{ fontSize: '20px', color: '#545e75' }}></i>
                    </button>
                  </Link>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}  onClick={()=>imprimir(ordem)} >
            <i className="fa fa-print" style={{ fontSize: '20px', color: '#545e75', marginRight: "5px" }}></i>
            
          </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        @media print {
          /* Oculta o botão de imprimir na impressão */
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
