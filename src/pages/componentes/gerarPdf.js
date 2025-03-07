const gerarPdf = async (ordem) => {
    try {
      const nomeArquivo = `${String(ordem?.cliente || "Relatório")}`;
      const resultado = await window.electron.gerarPdf(nomeArquivo);
  
      if (resultado.error) {
        console.error("Erro ao gerar PDF:", resultado.error);
      } else {
        alert(`PDF salvo em: ${resultado.path}`);
      }
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
    }
  };
  
  export default gerarPdf;
  