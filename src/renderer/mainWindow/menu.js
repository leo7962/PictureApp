import { remote } from 'electron';
import { openDirectory, SaveFile, openPreferences, uploadImage, pasteImage } from './ipcRendererEvents';
import { Print } from './imagesUi';

function createMenu() {
    const template = [{
        label: 'File',
        submenu: [{
            label: 'Open location',
            accelerator: 'CmdOrCtrl+O',
            click() {
                openDirectory();
            }
        }, {
            label: 'Save',
            accelerator: 'CmdOrCtrl+s',
            click() {
                SaveFile();
            }
        }, {
            label: 'Preferences',
            accelerator: 'CmdOrCtrl+,',
            click() {
                openPreferences();
            }
        }, {
            label: 'Close',
            role: 'quit'
        },
        ]
    }, {
        label: 'Edition',
        submenu: [
            {
                label: 'Print',  
                accelerator: 'CmdOrCtrl+p',              
                click() {
                    Print();
                }
            },
            {
                label: 'Upload to Cloudup',
                accelerator: 'CmdOrCtrl+u',
                click() {
                    uploadImage();
                }
            },
            {
                label: 'Paste Image',
                accelerator: 'CmdOrCtrl+v',
                click() {
                    pasteImage();
                }
            }
        ]
    }];
    const menu = remote.Menu.buildFromTemplate(template);
    remote.Menu.setApplicationMenu(menu);
}

module.exports = createMenu;