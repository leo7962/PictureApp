import url from 'url';
import path from 'path';

window.addEventListener('load', () => {
    GetImagesEvent();
    searchImages();
});

function GetImagesEvent() {
    const thumbs = document.querySelectorAll('li.list-group-item');

    for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].addEventListener('click', function () {
            changeImage(this);
        });
    }
}

function changeImage(node) {
    document.querySelector('li.selected').classList.remove('selected');
    node.classList.add('selected');
    document.getElementById('image-displayed').src = node.querySelector('img').src;
}

function searchImages() {
    const searchBox = document.getElementById('search-box');

    searchBox.addEventListener('keyup', function () {
        if (this.value.length > 0) {
            const regex = new RegExp(this.value.toLowerCase(), 'gi');
            if (this.value.length > 0) {
                const thumbs = document.querySelectorAll('li.list-group-item img');
                for (let index = 0; index < thumbs.length; index++) {
                    const fileUrl = url.pathToFileURL(thumbs[index].src);
                    const fileName = path.basename(fileUrl.pathname);
                    console.log(fileName);
                    if (fileName.match(regex)) {
                        thumbs[index].parentNode.classList.remove('hidden');
                    } else {
                        thumbs[index].parentNode.classList.remove('hidden');
                    }
                }

                selectFirstImage();
            }
        } else {
            showAll();
        }
    });
}

function selectFirstImage() {
    const image = document.querySelector('li.list-group-item:not(.hidden)');
    changeImage(image);
}

function showAll() {
    const listItems = document.querySelectorAll('.li.list-group-item');

    for (let index = 0; index < listItems.length; index++) {
        listItem[index].classList.remove('hidden');
    }
    selectFirstImage();
}