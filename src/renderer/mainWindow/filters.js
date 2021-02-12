import fs from 'fs-extra'

function applyFilter(filter, currentImage) {
    let imgObj = new Image() // eslint-disable-line
    imgObj.src = currentImage.dataset.original

    filterous.importImage(imgObj, { format: 'png' }) // eslint-disable-line
        .applyInstaFilter(filter)
        .renderHtml(currentImage);
}

function saveImage(filename, callback) {
    let fileSrc = document.getElementById('image-displayed').src;

    if (fileSrc.indexOf(';base64,') !== -1) {
        fileSrc = fileSrc.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFile(filename, fileSrc, 'base64', callback);
    } else {
        fileSrc = fileSrc.replace('file://', '');
        fs.copy(fileSrc, filename, callback);
    }
}

module.exports = {
    applyFilter: applyFilter,
    saveImage: saveImage
}