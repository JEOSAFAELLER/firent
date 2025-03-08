const { contextBridge, ipcRenderer } = require('electron');



contextBridge.exposeInMainWorld("electron", {
  gerarPdf: (nomeArquivo) => ipcRenderer.invoke("gerar-pdf", nomeArquivo),
  sendData: (data) => ipcRenderer.send("send-data", data),
  closeApp: () => ipcRenderer.send("close-app"),
});

window.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("reloaded")) {
    sessionStorage.setItem("reloaded", "true");
    window.location.reload();
  } else {
    sessionStorage.removeItem("reloaded");
  }
});


