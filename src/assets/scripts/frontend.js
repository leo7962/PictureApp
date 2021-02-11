import url from 'url';
import path from 'path';
import applyFilter from './filters';
import { setIpc, sendIpc } from './ipcRendererEvents';

window.addEventListener('load', () => {
    setIpc();
    GetImagesEvent();
    searchImages();
    selectFilter();
    OpenDirectory();
});

function OpenDirectory() {
    const openDirectory = document.getElementById('open-directory');
    openDirectory.addEventListener('click', () => {
        sendIpc()
    })
}

function GetImagesEvent() {
    const thumbs = document.querySelectorAll('li.list-group-item');

    for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].addEventListener('click', function () {
            changeImage(this);
        });
    }
}

function selectFilter() {
    const select = document.getElementById('filters');

    select.addEventListener('change', function () {
        applyFilter(this.value, document.getElementById('image-displayed'));
    })
}

function changeImage(node) {
    if (node) {
        document.querySelector('li.selected').classList.remove('selected');
        node.classList.add('selected');
        document.getElementById('image-displayed').src = node.querySelector('img').src;
    } else {
        document.getElementById('image-displayed').src = '';
    }
}

function searchImages() {
    const searchBox = document.getElementById('search-box');

    searchBox.addEventListener('keyup', function () {
        const regex = new RegExp(this.value.toLowerCase(), 'gi');

        if (this.value.length > 0) {
            const thumbs = document.querySelectorAll('li.list-group-item img');
            for (let index = 0; index < thumbs.length; index++) {
                const fileUrl = url.pathToFileURL(thumbs[index].src);
                const fileName = path.basename(fileUrl.pathname);
                if (fileName.match(regex)) {
                    thumbs[index].parentNode.classList.remove('hidden');
                } else {
                    thumbs[index].parentNode.classList.add('hidden');
                }
            }

            selectFirstImage();
        } else {
            showAll();
            selectFirstImage();
        }
    });
}

function selectFirstImage() {
    const image = document.querySelector('li.list-group-item:not(.hidden)');
    changeImage(image);
}

function showAll() {
    const thumbs = document.querySelectorAll('li.list-group-item img');

    for (let index = 0; index < thumbs.length; index++) {
        thumbs[index].parentNode.classList.remove('hidden');
    }
}