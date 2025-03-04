import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Home() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
        <h1>Bem-vindo ao Firent!</h1>
        <p>Estamos felizes em tê-lo aqui.</p>

        
      <Link href="/estoque">
        <button style={{ padding: '10px 20px', marginTop: '20px', fontSize: '16px' }}>
          Consultar Estoque
        </button>
      </Link>
      <Link href="/ordem-servico/list-os">
        <button style={{ padding: '10px 20px', marginTop: '20px', fontSize: '16px' }}>
          Ordem de Serviço
        </button>
      </Link>
      </div>
    );
  }
  


