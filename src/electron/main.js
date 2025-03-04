const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');


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
        nodeIntegration: true,
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
         
            nodeIntegration: true,
        },
    });

    mainWindow.loadURL('http://localhost:3000'); // Next.js rodando
Menu.setApplicationMenu(null);

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
});


