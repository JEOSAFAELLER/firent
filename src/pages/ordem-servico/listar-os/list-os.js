import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Ordens de Serviço</h1>

      {/* Botão para criar nova ordem */}
      <button
        onClick={handleCreate}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Criar Nova Ordem
      </button>
      <button onClick={handleVoltar} style={{ padding: '10px 20px', fontSize: '16px' }}>
          ↩️ Voltar
        </button>

      {/* Tabela de ordens */}
      <table border="1" cellPadding="7" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>O.S.</th>
            <th>Cliente</th>
            <th>Telefone</th>           
            <th>Valor</th>
            <th>Ações</th>
            <th>Ativo?</th>
          </tr>
        </thead>
        <tbody>
          {ordens.map((ordem) => (
            <tr key={ordem.os}>
              <td>{ordem.os}</td>
              <td>{ordem.cliente}</td>
              <td>{ordem.telefone}</td>             
              <td>{ordem.valor}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <Link href={`/ordem-servico/editar-os/${ordem.os}`}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <i className="fa fa-edit" style={{ fontSize: '20px', color: '#007bff' }}></i>
                    </button>
                  </Link>
                </td>
                <td>{ordem.ativo ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ordens;
