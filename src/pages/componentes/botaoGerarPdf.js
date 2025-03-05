import { useState } from "react";
import styles from '../global.module.css'

const BotaoGerarPdf = ({ ordem }) => {
    ;
  const [loading, setLoading] = useState(false);

  const gerarPdf = async () => {
    setLoading(true);
    try {
        const nomeArquivo = `ordem_${String(ordem?.cliente || "sem-id")}`; 
        console.log(nomeArquivo)
      const resultado = await window.electron.gerarPdf(nomeArquivo);

      if (resultado.error) {
        console.error("Erro ao gerar PDF:", resultado.error);
      } else {
        alert(`PDF salvo em: ${resultado.path}`);
      }
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className={styles.buttons} onClick={gerarPdf} disabled={loading}>
     <i className="fa fa-file-pdf" style={{ fontSize: '20px', color: '#f7f7ff', marginRight: "5px" }}></i> 
    Exportar 
    </button>
  );
};

export default BotaoGerarPdf;
