const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs");
//const { exec } = require("child_process");
//const net = require("net");
const portfinder = require("portfinder");
const http = require("http");
const next = require("next");



let splashWindow;
let mainWindow;

let NEXT_PORT = 3000;
let nextServer = null; // Agora a variável está garantida no escopo global
let nextApp = null;



async function setPort() {
  try {
    const availablePort = await portfinder.getPortPromise({ port: NEXT_PORT });
   // const availablePort = await portfinder.getPortPromise({ port: NEXT_PORT });

    if (availablePort !== NEXT_PORT) {
      console.log(`Porta ${NEXT_PORT} ocupada, tentando a porta ${availablePort}...`);
      NEXT_PORT = availablePort;
    }

    console.log(`Usando a porta ${NEXT_PORT}`);
  } catch (err) {
    console.error("Erro ao encontrar porta disponível:", err);
  }
}



//const NEXT_PROCESS = Symbol('nextProcess');

//const nextPath = path.join(__dirname, "../../node_modules/.bin/next");

async function startNextJSServer() {
  try {
    const nextApp = next({ dev: !app.isPackaged, dir: path.join(__dirname, "..") });
    await nextApp.prepare();
    
    const handle = nextApp.getRequestHandler();

   

    const nextServer = http.createServer((req, res) => handle(req, res));

    return new Promise((resolve, reject) => {
      nextServer.listen(NEXT_PORT, (err) => {
        if (err) {
          console.error("Erro ao iniciar Next.js:", err);
          reject(err);
        } else {
          console.log(`Next.js rodando na porta ${NEXT_PORT}`);
          resolve(NEXT_PORT);
        }
      });
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor Next.js:", error);
    throw error;
  }
}
    


function stopNextJSServer() {
  if (nextServer) {
    console.log("Finalizando Next.js...");
    nextServer.close(() => {
      console.log("Next.js finalizado.");
    });
  }
}

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
  }, 5000);
}


const iconPath = path.join(__dirname, "./public/icon" + 
  (process.platform === "win32" ? ".ico" : process.platform === "darwin" ? ".icns" : ".png")
);

app.whenReady().then(async() => {
await setPort();
    createSplashScreen();
    console.log("Iniciando Next.js...");
    //const nextProcess = exec(`${nextPath} dev -p ${NEXT_PORT}`, { cwd: path.join(__dirname, "..") });
    // console.log(nextProcess)
    // nextProcess.stdout.on("data", (data) => console.log(`Next.js: ${data}`));
    // nextProcess.stderr.on("data", (data) => console.error(`Next.js Error: ${data}`));
  
    // nextProcess.on("exit", (code) => console.log(`Next.js finalizado com código ${code}`));
  
    // app[NEXT_PROCESS] = nextProcess;

    await startNextJSServer();


    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: iconPath,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            
        },
    });
    if (app.isPackaged) {
      appServe(mainWindow).then(() => {
        mainWindow.loadURL("app://-");
      });
    }else{
      setTimeout(() =>{
        mainWindow.loadURL(`http://localhost:${NEXT_PORT}`);
      
      }, 5000);

    }


     // Next.js rodando
Menu.setApplicationMenu(null);

mainWindow.webContents.openDevTools();




app.on("window-all-closed", () => {
  stopNextJSServer();
  
  if (process.platform !== "darwin") app.quit();
});

    ipcMain.on("close-app", () => {
      stopNextJSServer();
      app.quit();
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



