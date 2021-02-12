import { remote, ipcRenderer } from 'electron';
import settings from 'electron-settings';
import CryptoJS from 'crypto-js';

window.addEventListener('load', () => {
    CancelButton();
    SaveButton();

    if (settings.has('cloudup.user')) {
        document.getElementById('cloudup-user').value = settings.get('cloudup.user');
    }

    if (settings.has('cloudup.passwd')) {
        const decipher = CryptoJS.AES.decrypt(
            settings.getSync("cloudup.passw"), "PictureApp");

        let decrypted = decipher.toString(CryptoJS.enc.utf8);

        document.getElementById('cloudup-user').value = decrypted;
    }
})

function CancelButton() {
    const cancelButton = document.getElementById('cancel-button');
    cancelButton.addEventListener('click', () => {
        const prefsWindow = remote.getCurrentWindow();
        prefsWindow.close();
    });
}

function SaveButton() {
    const saveButton = document.getElementById('save-button');
    const prefsForm = document.getElementById('preferences-form');

    saveButton.addEventListener('click', () => {
        if (prefsForm.reportValidity()) {
            const encrypted = CryptoJS.AES.encrypt(
                document.getElementById('cloudup-passwd').value,
                "PictureApp"
            ).toString();
            settings.set('cloudup', {
                user: document.getElementById('cloudup-user').Value,
                passwd: encrypted
            });
            const prefsWindow = remote.getCurrentWindow();
            prefsWindow.close();
        } else {
            ipcRenderer.send('show-dialog', { type: 'error', title: 'PictureApp', message: 'Please complate the fields' });
        }
    });
}