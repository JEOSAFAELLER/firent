// src/pages/cadastro-produto.js
import { useState } from 'react';
import { useRouter } from 'next/router'
import styles from '../../global.module.css'


export default function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const router = useRouter();
  const handleSubmit =
    async (e) => {
      e.preventDefault();
      const response = await fetch('/api/estoque', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, quantidade }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Produto cadastrado!');
      } else {
        alert('Erro ao cadastrar produto!');
      }

      setNome('');
      setQuantidade('');
      setPreco('');

      // Aqui você pode fazer uma chamada para uma API ou enviar os dados ao backend
      console.log({ nome, quantidade });

      // Limpar os campos após o envio
      setNome('');
      setQuantidade('');
      setPreco('');
      handleVoltar();
    };

  const handleVoltar = () => {
    router.back(); // Volta para a página anterior
  };

  return (
    <div className={styles.container} >
      <div className={styles.titulo}>
        <h1>Cadastro de Produto</h1>
      </div>
      <div className={styles.barra_pages}>
        
          <button className={styles.buttons} onClick={handleSubmit} style={{color:'#f2d0a4'}} >
          <i className="fa fa-floppy-disk" style={{ fontSize: '20px', color: '#f2d0a4', marginRight: "5px" }}></i>
            Salvar
          </button>
        

        <button className={styles.buttons} onClick={handleVoltar} >
          <i className="fa fa-arrow-left" style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}></i>
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
