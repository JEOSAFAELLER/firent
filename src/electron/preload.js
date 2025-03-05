const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electron', {
//   ipcRenderer: {
//     send: (channel, data) => ipcRenderer.send(channel, data),
//     on: (channel, callback) => ipcRenderer.on(channel, (_, data) => callback(data)),
//     once: (channel, callback) => ipcRenderer.once(channel, (_, data) => callback(data)),
//   }
// });

contextBridge.exposeInMainWorld("electron", {
  gerarPdf: (nomeArquivo) => ipcRenderer.invoke("gerar-pdf", nomeArquivo),
});

