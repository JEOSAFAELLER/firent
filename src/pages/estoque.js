// src/pages/estoque.js
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Estoque() {
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

 


  return (
    <div style={{ padding: '20px' }}>
      <h1>Estoque Geral</h1>
      <Link href="/cadastro-produto">
        <button style={{ padding: '10px 20px', marginTop: '20px', fontSize: '16px' }}>
          Cadastrar Novo Produto
        </button>
      </Link>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Código</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nome do Produto</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quantidade</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ação</th> 
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ativo?</th> 
          </tr>
        </thead>
        <tbody>
          {estoque.length > 0 ? (
            estoque.map((produto) => (
              <tr key={produto.codigo}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{produto.codigo}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{produto.nome}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{produto.quantidade}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <Link href={`/editar-produto/${produto.codigo}`}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                     editar
                      <i className="fa fa-edit" style={{ fontSize: '20px', color: '#007bff' }}></i>
                    </button>
                  </Link>
                                
                  
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{produto.ativo ? 'ativo': 'Inativo'}</td>
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
      <Link href="/">
        <button style={{ padding: '10px 20px', marginTop: '20px', fontSize: '16px' }}>
          Voltar para a Página Inicial
        </button>
      </Link>
    </div>
  );
}
