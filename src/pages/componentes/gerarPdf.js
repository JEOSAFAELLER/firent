

const gerarPdf = async (ordem, setToastMessage, setToastType) => {
    try {
      const nomeArquivo = `${String(ordem?.cliente || "Relatório")}`;
      const resultado = await window.electron.gerarPdf(nomeArquivo);
  
      if (resultado.error) {
        setToastMessage("Erro ao gerar PDF!");
      setToastType("error");
        console.error("Erro ao gerar PDF:", resultado.error);
      } else {

        setToastMessage(`PDF salvo em: ${resultado.path}`);
        setToastType("success");
        
       
      }
      setTimeout(() => {
        setToastMessage("");
        setToastType(null);
      }, 3000);
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
    }
  };
  
  export default gerarPdf;
  