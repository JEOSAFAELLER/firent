import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
      router.push('/estoque');
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Editar Produto</h1>
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
        {produto.ativo ? 'Ativo': 'Ativo'}  
        
        </label>
      </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="nome">Alterar nome do produto para:</label>
          <input
            type="text"
            id="nome"
            value={produto.nome}
            onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
            required
            style={{ padding: '8px', marginLeft: '10px', width: '200px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="quantidade">Alterar quantidade para:</label>
          <input
            type="number"
            id="quantidade"
            value={produto.quantidade}
            onChange={(e) => setProduto({ ...produto, quantidade: e.target.value })}
            required
            style={{ padding: '8px', marginLeft: '10px', width: '100px' }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            marginTop: '20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Atualizar Produto
        </button>

      </form>

     
      <Link href="/estoque">
        <button style={{ padding: '10px 20px', marginTop: '20px', fontSize: '16px' }}>
          Cancelar
        </button>
      </Link>
    </div>
  );
}
