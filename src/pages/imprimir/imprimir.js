'use client';
import { useEffect, useState } from 'react';


export default function BotaoImprimir() {
  const [ipcRenderer, setIpcRenderer] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electron) {
      setIpcRenderer(window.electron.ipcRenderer);
    }
  }, []);

  const handlePrint = () => {
    if (ipcRenderer) {
      console.log("📨 Enviando evento de impressão...");
      ipcRenderer.send('imprimir-documento', '<h1>Documento para Impressão</h1><p>Este é um exemplo de impressão no Electron.</p>');

      ipcRenderer.once('impressao-concluida', (sucesso) => {
        if (sucesso) {
          
          console.log('🖨️ Impressão concluída com sucesso!');
        } else {
          console.log('❌ Erro ao imprimir.');
        }
      });

      ipcRenderer.once('erro-impressao', (mensagem) => {
        console.log(`❌ Erro ao imprimir: ${mensagem}`);
      });
    } else {
      console.error("❌ ipcRenderer não está disponível.");
    }
  };

  return <button onClick={handlePrint}>Imprimir</button>;
}
