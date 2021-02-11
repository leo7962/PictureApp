import { ipcRenderer } from 'electron';
import { GetImagesEvent, DeleteImages, LoadImages, selectFirstImage } from './imagesUi';
import path from 'path';
import { saveImage } from './filters'

function setIpc() {
    ipcRenderer.on('load-images', (event, images) => {
        DeleteImages();
        LoadImages(images);
        GetImagesEvent();
        selectFirstImage();
    });

    ipcRenderer.on('save-image', (event, file) => {
        console.log(file);
        saveImage(file, (err) => {
            if (err) {
                return showDialog('error', 'PictureApp', err.message);
            } else {
                return showDialog('info', 'PictureApp', 'Image success saved')
            }
        });
    });
}

function openDirectory() {
    ipcRenderer.send('open-directory');
}

function showDialog(type, title, msg) {
    ipcRenderer.send('show-dialog', { type: type, title: title, message: msg });
}

function SaveFile() {
    const image = document.getElementById('image-displayed').dataset.original;
    const ext = path.extname(image);

    ipcRenderer.send('open-save-dialog', ext);
}

module.exports = {
    setIpc: setIpc,
    SaveFile: SaveFile,
    openDirectory: openDirectory
}