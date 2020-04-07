const {ipcRenderer} = require('electron');
const shell = require('electron').shell;

$('#advSwitch').click(() => {
    var checkedValue = document.querySelector('#advSwitch').checked;
    if (checkedValue == true) {
        ipcRenderer.send('debugTypeChange', true);
    } else if (checkedValue == false) {
        ipcRenderer.send('debugTypeChange', false);
    }
});

ipcRenderer.on('midiLog', (event, args) => {
    $('#debugLogField').append("[" + new Date().toLocaleTimeString() + "] " + args + "\n");
    $('#debugLogField').scrollTop($('#debugLogField')[0].scrollHeight);
});

// Social Media
$("#github").click(function() {
    shell.openExternal("https://github.com/ejj28/mididrumhero");
});