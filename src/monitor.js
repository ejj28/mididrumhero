const {ipcRenderer} = require('electron');

$('#advancedButton').click(() => {
    ipcRenderer.send('message');
});

ipcRenderer.on('midiLog', (event, args) => {
    $('#debugLogField').append("[" + new Date().toLocaleTimeString() + "] " + args + "\n");
});