const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs");


let splashWindow;
let mainWindow;

function createSplashScreen() {
    splashWindow = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false, // Remove a borda da janela
      transparent: true, // Torna a janela transparente (opcional)
      alwaysOnTop: true, // Mantém a splash screen no topo
      resizable: false, // Impede redimensionamento
      webPreferences: {
       
        nodeIntegration: false,
        contextIsolation: false,
        enableRemoteModule: false,
      },
    });
    // Carrega a splash screen
  splashWindow.loadFile(path.join(__dirname, 'splash.html'));

  // Fecha a splash screen após 3 segundos (opcional)
  setTimeout(() => {
    if (splashWindow) splashWindow.close();
  }, 3000);
}




app.whenReady().then(() => {
    createSplashScreen();
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWindow.loadURL('http://localhost:3000'); // Next.js rodando
Menu.setApplicationMenu(null);

mainWindow.webContents.openDevTools();




    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });

    
    ipcMain.handle("gerar-pdf", async (event, nomeArquivo) => {
      console.log("Nome do arquivo recebido pelo IPC:", nomeArquivo);
      const pdfPath = path.join(app.getPath("documents"), `${nomeArquivo}.pdf`);
      const win = BrowserWindow.getFocusedWindow();
  
      if (!win) return { error: "Nenhuma janela ativa encontrada!" };
  
      try {
        const data = await win.webContents.printToPDF({});
        fs.writeFileSync(pdfPath, data);
        return { path: pdfPath };
      } catch (error) {
        return { error: error.message };
      }
    });
    


});



