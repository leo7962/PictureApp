import { setIpc, openDirectory, SaveFile, openPreferences, uploadImage } from './mainWindow/ipcRendererEvents';
import { GetImagesEvent, searchImages, selectFilter, Print } from './mainWindow/imagesUi';

window.addEventListener('load', () => {
    setIpc();
    GetImagesEvent();
    searchImages();
    selectFilter();
    OpenFolder('open-directory', openDirectory);
    OpenFolder('open-preferences', openPreferences);
    OpenFolder('save-button', SaveFile);
    OpenFolder('print', Print);
    OpenFolder('upload', uploadImage);
});

function OpenFolder(id, func) {
    const openDirectory = document.getElementById(id);
    openDirectory.addEventListener('click', func);
}