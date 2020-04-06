const {ipcRenderer} = require('electron');

ipcRenderer.on('midiLog', (event, ...args) => {
    console.log(message)
})