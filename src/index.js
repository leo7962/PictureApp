'use strict';

// Instanciando los objetos app y BrowserWindow
import { app, BrowserWindow} from 'electron';
import devtools from './devtools';
import handleerror from './handleerror';
import MainIpc from './ipcMainFunctions';

global.win;

if (process.env.NODE_ENV === 'development') {
    devtools();
    //preload();
    console.log("Ejecutando aplicativo");
}

// Imprimiendo un mensaje en la consola antes de salir
app.on('before-quit', () => {
    console.log('Saliendo del aplicativo...');
});

// Ejecuntando ordenes cuando la aplicación está lista
app.on('ready', () => {
    // Creando una ventana
    win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Bienvenido Leo',
        center: true,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    MainIpc(win);
    handleerror(win);

    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('move', () => {
        const position = win.getPosition();
        console.log(`La posición es ${position}`);
    });

    // Detectando el cierre de la ventana para finalizar el aplicativo
    win.on('closed', () => {
        win = null;
        app.quit();
    });

    win.loadURL(`file://${__dirname}/renderer/index.html`);
});
