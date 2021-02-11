'use strict';

// Instanciando los objetos app y BrowserWindow
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import devtools from './devtools';
import fs from 'fs';
import filesize from 'filesize';
import isImage from 'is-image';
import path from 'path';
import handleerror from './handleerror';


let win;

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

ipcMain.on('open-directory', (event, args) => {
    console.log('arguments' + args);
    dialog.showOpenDialog(win, {
        title: 'Select the new location',
        buttonLabel: 'Open location',
        properties: ['openDirectory']
    }).then(result => {
        // Verifica si usuario cancelo la operación
        if (result.canceled) {
            return;
        }

        // Obtiene la ruta de la carpeta seleccionada
        const filesPath = result.filePaths[0];

        // Solo muestra el primer directorio
        fs.readdir(filesPath, (error, files) => {
            // Declara arreglo vacio de imagenes
            let images = [];

            // Verifica el error
            if (error) {
                console.log(error);
                return;
            }

            // Recorre archivos uno a uno
            for (let i = 0; i < files.length; i++) {
                // Verifica si es una imagen
                if (isImage(files[i])) {
                    // Obtiene información de imagen
                    let imageFile = path.join(filesPath, files[i]);
                    let imageStats = fs.statSync(imageFile);
                    let imageSize = filesize(imageStats.size, { round: 0 });

                    // Agrega información de imagen al arreglo
                    images.push({ fileName: files[i], src: `file://${imageFile}`, size: imageSize });
                }
            }

            event.sender.send('load-images', images);

            // Muestra imagenes
            console.log(images);
        });
    }).catch(err => {
        console.log(err);
    });
});

ipcMain.on('open-save-dialog', (event, ext) => {
    dialog.showSaveDialog(win, {
        title: 'Save image edited',
        buttonLabel: 'Save image',
        filters: [{ name: 'Images', extensions: [ext.substr(1)] }]
    }).then(file => {
        if (file) {
            event.sender.send('save-image', file);
        }
    });
});

ipcMain.on('show-dialog', (event, info) => {
    dialog.showMessageBox(win, {
        type: info.type,
        title: info.title,
        message: info.message
    });
});