import url from 'url';
import path from 'path';
import { applyFilter } from './filters';

function changeImage(node) {
    if (node) {
        const selected = document.querySelector('li.selected');
        if (selected) {
            selected.classList.remove('selected');
        }
        node.classList.add('selected');
        const image = document.getElementById('image-displayed');
        image.src = node.querySelector('img').src;
        image.dataset.original = image.src;
        document.getElementById('filters').selectedIndex = 0;
    } else {
        document.getElementById('image-displayed').src = '';
    }
}

function GetImagesEvent() {
    const thumbs = document.querySelectorAll('li.list-group-item');

    for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].addEventListener('click', function () {
            changeImage(this);
        });
    }
}

function selectFirstImage() {
    const image = document.querySelector('li.list-group-item:not(.hidden)');
    changeImage(image);
}

function selectFilter() {
    const select = document.getElementById('filters');

    select.addEventListener('change', function () {
        applyFilter(this.value, document.getElementById('image-displayed'));
    });
}

function searchImages() {
    const searchBox = document.getElementById('search-box');

    searchBox.addEventListener('keyup', function () {
        const regex = new RegExp(this.value.toLowerCase(), 'gi');

        if (this.value.length > 0) {
            const thumbs = document.querySelectorAll('li.list-group-item img');
            for (let index = 0; index < thumbs.length; index++) {
                const fileUrl = url.pathToFileURL(thumbs[index].src);
                const filename = path.basename(fileUrl.pathname);
                if (filename.match(regex)) {
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

function showAll() {
    const thumbs = document.querySelectorAll('li.list-group-item img');

    for (let index = 0; index < thumbs.length; index++) {
        thumbs[index].parentNode.classList.remove('hidden');
    }
}

function DeleteImages() {
    const oldImages = document.querySelectorAll('li.list-group-item');
    for (let i = 0; i < oldImages.length; i++) {
        oldImages[i].parentNode.removeChild(oldImages[i]);
    }
}

function LoadImages(images) {
    const imagesList = document.querySelector('ul.list-group');

    for (let i = 0; i < images.length; i++) {
        const node = `<li class="list-group-item">
                    <img class="img-circle media-object pull-left" src="${images[i].src}" width="32" height="32">
                        <div class="media-body">
                            <strong>${images[i].filename}</strong>
                                <p>${images[i].size}</p>
                        </div>
                    </li>`;
        imagesList.insertAdjacentHTML('beforeend', node);

    }
}

function Print(){
    window.print();
}

module.exports = {
    changeImage: changeImage,
    GetImagesEvent: GetImagesEvent,
    selectFirstImage: selectFirstImage,
    selectFilter: selectFilter,
    searchImages: searchImages,
    DeleteImages: DeleteImages,
    LoadImages: LoadImages,
    Print: Print,
}
