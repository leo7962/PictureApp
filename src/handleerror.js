import { dialog, app } from 'electron';

function relaunchApp(win) {
    dialog.showMessageBox(win, {
        type: 'error',
        title: 'PictureApp',
        message: 'Occurred a unexpected error'
    }).then(() => {
        app.relaunch();
        app.exit(0);
    })
}

function setupErrors(win) {
    win.webContents.on('crashed', () => {
        relaunchApp(win);
    });

    win.on('unresponsive', () => {
        dialog.showMessageBox(win, {
            type: 'warning',
            title: 'PictureApp',
            message: 'Unexpected load'
        }).then(() => {
            relaunchApp(win);
        });
    });

    process.on('uncaughtException', () => {
        relaunchApp(win);
    })
}

module.exports = setupErrors;