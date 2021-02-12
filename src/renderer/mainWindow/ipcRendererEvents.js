import { ipcRenderer, remote, clipboard, shell } from 'electron';
import settings from 'electron-settings';
import { GetImagesEvent, DeleteImages, LoadImages, selectFirstImage } from './imagesUi';
import path from 'path';
import { saveImage } from './filters';
import Cloudup from 'cloudup-client';
import crypto from 'crypto'

async function setIpc() {
    if (settings.has('directory')) {
        ipcRenderer.send('load-directory', await settings.get('directory'));
    }
    ipcRenderer.on('load-images', (event, dir, images) => {
        DeleteImages();
        LoadImages(images);
        GetImagesEvent();
        selectFirstImage();
        settings.set('directory', dir);
        console.log(settings.file());
        document.getElementById('directory').innerHTML = dir;
    });

    ipcRenderer.on('save-image', (event, file) => {
        console.log(file);
        saveImage(file, (err) => {
            if (err) {
                return showDialog('error', 'PictureApp', err.message);                
            } else {
                document.getElementById('image-displayed').dataset.filtered = file;
                return showDialog('info', 'PictureApp', 'Image success saved')
            }
        });
    });
}

function openPreferences() {
    const BrowserWindow = remote.BrowserWindow;
    const mainWindow = remote.getGlobal('win');

    const preferencesWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Preferences',
        center: true,
        modal: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // if (os.platform() !== 'win32') {
    preferencesWindow.setParentWindow(mainWindow);
    // }    
    preferencesWindow.once('ready-to-show', () => {
        preferencesWindow.show();
        preferencesWindow.focus();
    });
    preferencesWindow.show();
    preferencesWindow.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`);
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

function uploadImage() {
    let imageNode = document.getElementById('image-displayed');
    let image;

    if (imageNode.dataset.filtered) {
        image = imageNode.dataset.filtered;
    } else {
        image = imageNode.src;
    }

    image = image.replace('file://', '');
    let fileName = path.basename(image);
    if (settings.has('cloudup.user') && settings.has('cloudup.passwd')) {

        document.getElementById('overlay').classList.toggle('hidden');

        const decipher = crypto.createDecipher('aes192', 'PictureApp');

        let decrypted = decipher.update(settings.get('cloudup.passwd'), 'hex', 'utf8');
        decrypted += decipher.final('utf8')

        const client = Cloudup({
            user: settings.get('cloudup.user'),
            pass: decrypted
        });

        const stream = client.stream({ title: `PictureApp - ${fileName}` });

        stream.file(image).save((err) => {
            document.getElementById('overlay').classList.toggle('hidden');
            if (err) {
                showDialog('error', 'PictureApp', "Error, your credentials doesn't exists");
            } else {
                clipboard.writeText(stream.url);
                const notify = new Notification('PictureApp', { //eslint-disable-line
                    body: `Imagen cargada con éxito - ${stream.url}, el enlace se copio al portapeles ` +
                        `De click para abrir la url`,
                    silent: false
                });

                notify.onclick = () => {
                    shell.openExternal(stream.url);
                }
            }
        })

    } else {
        showDialog('error', 'PictureApp', 'Please, complate the preferences for CloudUp');
    }
}

function pasteImage () {
    const image = clipboard.readImage()
    const data = image.toDataURL()
    if (data.indexOf('data:image/png;base64') !== -1 && !image.isEmpty()) {
      let mainImage = document.getElementById('image-displayed')
      mainImage.src = data
      mainImage.dataset.original = data
    } else {
      showDialog('error', 'Platzipics', 'No hay una imagen valida en el portapapeles')
    }
  }

module.exports = {
    setIpc: setIpc,
    SaveFile: SaveFile,
    openDirectory: openDirectory,
    openPreferences: openPreferences,
    uploadImage: uploadImage,
    pasteImage: pasteImage
}