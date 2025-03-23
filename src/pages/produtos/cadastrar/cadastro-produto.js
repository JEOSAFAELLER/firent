// src/pages/cadastro-produto.js
import { useState } from 'react';
import { useRouter } from 'next/router'
import styles from '../../global.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import  ToastOK  from '../../componentes/toast/toastOK';
import  ToastError  from '../../componentes/toast/toastError';
import  ToastAlert  from '../../componentes/toast/toastAlert';


export default function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [message, setMessage] = useState("on" | "off")
  const [status, setStatus] = useState('ok' | 'error')
  const router = useRouter();
  
  const handleSubmit =

    async (e) => {
      e.preventDefault();

if(!nome || !quantidade ){
  setMessage("on")
  setTimeout(() => setMessage(""), 3000)

  return;
} 


      const response = await fetch('/api/estoque', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, quantidade }),
      });

      if (response.ok) {
        
        setStatus("ok");
        setTimeout(() => router.back(), 3000)
        
      } else {
      setStatus("error")
      setTimeout(() => setStatus(""), 2000)
      }
    

     

      // Aqui você pode fazer uma chamada para uma API ou enviar os dados ao backend
      console.log({ nome, quantidade });

      // Limpar os campos após o envio
      setNome('');
      setQuantidade('');
      
     
    };

  const handleVoltar = () => {
    router.back(); // Volta para a página anterior
  };

  return (
    <div className={styles.container} >
      <div className={styles.titulo}>
        <h1>Cadastro de Produto</h1>
      </div>
      { status === "ok" && <ToastOK />}
      {status === "error" && <ToastError />}
      {message === "on" && <ToastAlert message={"Preencha todos os campos"} />}
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
      
  <div className={styles.formProduto}>
  <form onSubmit={handleSubmit}>
    <table className={styles.formProduto} >
     
      <thead>
          <tr>        
            <th className={styles.celula}>Nome do Produto</th>
            <th className={styles.celula}>Quantidade</th>     
           
          </tr>
        </thead>
      
      <tbody>
        <tr>
          
          <td className={styles.celula}>
            <input
            className={styles.input_td}
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </td>       
          
          <td className={styles.celula}>
            <input
            className={styles.input_td}
              type="number"
              id="quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
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
