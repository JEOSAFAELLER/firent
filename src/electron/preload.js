// Aqui você pode usar o Electron para comunicar o frontend com o backend
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    listarEstoque: () => ipcRenderer.invoke('listarEstoque'),
    adicionarItem: (nome, quantidade) => ipcRenderer.invoke('adicionarItem', nome, quantidade),
});
