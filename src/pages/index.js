import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './global.module.css'


export default function Index() {
  return (

    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Bem-vindo ao Firent!</h1>
        

      </div>

      <div className={styles.barra}>
        <Link href="/produtos/listar/estoque">
          <button className={styles.buttons} >
            Consultar Estoque
          </button>
        </Link>
        <Link href="/ordem-servico/listar-os/list-os">
          <button className={styles.buttons} >
            Ordem de Serviço
          </button>
        </Link>

      </div>

      



    </div>
  );
}



