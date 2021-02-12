import { setIpc, openDirectory, SaveFile, openPreferences, uploadImage, pasteImage } from './mainWindow/ipcRendererEvents';
import { GetImagesEvent, searchImages, selectFilter, Print } from './mainWindow/imagesUi';
import createMenu from './mainWindow/menu';

window.addEventListener('load', () => {
    createMenu();
    setIpc();
    GetImagesEvent();
    searchImages();
    selectFilter();
    OpenFolder('open-directory', openDirectory);
    OpenFolder('open-preferences', openPreferences);
    OpenFolder('save-button', SaveFile);
    OpenFolder('print', Print);
    OpenFolder('upload', uploadImage);
    OpenFolder('paste', pasteImage);
});

function OpenFolder(id, func) {
    const openDirectory = document.getElementById(id);
    openDirectory.addEventListener('click', func);
}