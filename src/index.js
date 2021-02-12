'use strict';

// Instanciando los objetos app y BrowserWindow
import { app, BrowserWindow, Tray, nativeImage } from 'electron';
import devtools from './devtools';
import handleerror from './handleerror';
import MainIpc from './ipcMainFunctions';
import os from 'os';
import path from 'path';

global.win;
global.tray;

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
    global.win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Bienvenido Leo',
        center: true,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    MainIpc(global.win);
    handleerror(global.win);

    global.win.once('ready-to-show', () => {
        global.win.show();
    });

    win.on('move', () => {
        const position = win.getPosition();
        console.log(`La posición es ${position}`);
    });

    // Detectando el cierre de la ventana para finalizar el aplicativo
    global.win.on('closed', () => {
        global.win = null;
        app.quit();
    });

    let icon
    if (os.platform() === 'win32') {
        //icon = path.loadURL(`file://${__dirname}/assets/icon/tray-icon.ico`);
        icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.ico');
    } else {
        icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.png');
    }

    global.tray = new Tray(nativeImage.createFromPath(icon));
    //global.tray.setTooltip('PictureApp');
    // global.tray.on('click', () => {
    //     global.win.isVisible() ? global.win.hide() : global.win.show();
    // })

    global.win.loadURL(`file://${__dirname}/renderer/index.html`);
});
