const {ipcRenderer} = require('electron');

$('#advSwitch').click(() => {
    console.log("flick")
    var checkedValue = document.querySelector('#advSwitch').checked;
    if (checkedValue == true) {
        console.log("true")
        ipcRenderer.send('debugTypeChange', true);
    } else if (checkedValue == false) {
        console.log("false")
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