import { setIpc, openDirectory, SaveFile, openPreferences } from './mainWindow/ipcRendererEvents';
import { GetImagesEvent, searchImages, selectFilter } from './mainWindow/imagesUi';

window.addEventListener('load', () => {
    setIpc();
    GetImagesEvent();
    searchImages();
    selectFilter();
    OpenFolder('open-directory', openDirectory);
    OpenFolder('open-preferences', openPreferences);
    OpenFolder('save-button', SaveFile);
});

function OpenFolder(id, func) {
    const openDirectory = document.getElementById(id);
    openDirectory.addEventListener('click', func);
}