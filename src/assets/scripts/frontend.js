import { setIpc, openDirectory, SaveFile } from './ipcRendererEvents';
import { GetImagesEvent, searchImages, selectFilter } from './imagesUi';

window.addEventListener('load', () => {
    setIpc();
    GetImagesEvent();
    searchImages();
    selectFilter();
    OpenFolder('open-directory', openDirectory);
    OpenFolder('save-button', SaveFile);
});

function OpenFolder(id, func) {
    const openDirectory = document.getElementById(id);
    openDirectory.addEventListener('click', func);
}