const { app, BrowserWindow } = require('electron');
const path = require('path');



let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    mainWindow.loadURL('http://localhost:3000'); // Next.js rodando

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
});
