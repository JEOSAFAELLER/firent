import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './global.module.css'
import { faBoxesStacked, faDoorOpen, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { over } from 'lodash';



export default function Index() {
  return (

    <div className={styles.container} style={{overflow:"hidden"}}>
      <div className={styles.titulo}>
        <h1>Bem-vindo ao Firent!</h1>
        

      </div>

      <div className={styles.barra_pages}>
        <Link href="/produtos/listar/estoque">
          <button className={styles.buttons} >
            <FontAwesomeIcon icon={faBoxesStacked} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }} />
            Consultar Estoque
          </button>
        </Link>
        <Link href="/ordem-servico/listar-os/list-os">
          <button className={styles.buttons} >
          <FontAwesomeIcon icon={faScrewdriverWrench} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }} />
            
            Ordem de Serviço
          </button>
        </Link>

        <button className={styles.buttons} onClick={() => window.electron.closeApp()} >
          <FontAwesomeIcon icon={faDoorOpen} style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }} />
            
            Sair
          </button>


      </div>

     
      <div style={{display:"flex", justifyContent:'center', alignItems:"center",  width: "100%", height: "auto" }}>
  <img
    src="/tree4.png" 
    style={{ width: "100%", height: "auto",  maxWidth:"1200px", objectFit: "cover"}} // Controla o tamanho da imagem
    alt="Imagem ilustrativa"
  />
</div>
     




    </div>
  );
}



