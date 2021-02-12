import fs from 'fs';
import filesize from 'filesize';
import isImage from 'is-image';
import path from 'path';
import { ipcMain, dialog } from 'electron';

function MainIpc(win) {
    ipcMain.on('open-directory', (event, args) => {
        console.log('arguments' + args);
        dialog.showOpenDialog(win, {
            title: 'Select the new location',
            buttonLabel: 'Open location',
            properties: ['openDirectory']
        }).then(dir => {
            // Verifica si usuario cancelo la operación
            if (dir.canceled) {
                return;
            }

            if (dir) {
                loadImages(event, dir[0])
            }

        }).catch(err => {
            console.log(err);
        });
    });

    ipcMain.on('load-directory', (event, dir) => {
        loadImages(event, dir);
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
}

function loadImages(event, dir) {

    const images = []

    fs.readdir(dir, (err, files) => {
        if (err) throw err

        for (var i = 0; i < files.length; i++) {
            if (isImage(files[i])) {
                let imageFile = path.join(dir, files[i])
                let stats = fs.statSync(imageFile)
                let size = filesize(stats.size, { round: 0 })
                images.push({ filename: files[i], src: `file://${imageFile}`, size: size })
            }
        }

        event.sender.send('load-images', dir, images)

        // Muestra imagenes
        console.log(images);
    });
}

module.exports = MainIpc;