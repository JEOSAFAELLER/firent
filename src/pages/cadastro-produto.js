// src/pages/cadastro-produto.js
import { useState } from 'react';
import Link from 'next/link';

export default function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');

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
        console.log('Produto cadastrado:', data);
      } else {
        console.log('Erro ao cadastrar produto');
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
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cadastro de Produto</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="nome">Nome do Produto:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ padding: '8px', marginLeft: '10px', width: '300px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="quantidade">Quantidade:</label>
          <input
            type="number"
            id="quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            required
            style={{ padding: '8px', marginLeft: '10px', width: '100px' }}
          />
        </div>

       
        <button type="submit" style={{ padding: '10px 20px' }}>
          Salvar
        </button>
      </form>

      <Link href="/">
        <button style={{ padding: '10px 20px', marginTop: '20px', fontSize: '16px' }}>
          Voltar para a Página Inicial
        </button>
      </Link>
    </div>
  );
}
