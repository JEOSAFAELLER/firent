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
  sendData: (data) => ipcRenderer.send("send-data", data),
});

window.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("reloaded")) {
    sessionStorage.setItem("reloaded", "true");
    window.location.reload();
  } else {
    sessionStorage.removeItem("reloaded");
  }
});


