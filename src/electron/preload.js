const { contextBridge, ipcRenderer } = require('electron');



contextBridge.exposeInMainWorld("electron", {
  gerarPdf: (nomeArquivo) => ipcRenderer.invoke("gerar-pdf", nomeArquivo),
  sendData: (data) => ipcRenderer.send("send-data", data),
  closeApp: () => ipcRenderer.send("close-app"),
  on: (channel, callback) => {
    ipcRenderer.on(channel, callback);
},
send: (channel, args) => {
    ipcRenderer.send(channel, args);
}


});

window.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("reloaded")) {
    sessionStorage.setItem("reloaded", "true");
    window.location.reload();
  } else {
    sessionStorage.removeItem("reloaded");
  }
});


