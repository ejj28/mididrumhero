const {ipcRenderer} = require('electron');
const shell = require('electron').shell;




// Initialize
$(document).ready(() => {

    // Check vJoy status
    var vJoyStatus = ipcRenderer.sendSync('getVjoyStatus');
    if (vJoyStatus == false) {
        alert("vJoy is either not installed or enabled, please fix this and then reopen MidiDrumHero")
    } 

    var keysSwitchState = ipcRenderer.sendSync('getKeysSwitchState');
    document.getElementById("keysSwitch").checked = keysSwitchState;

    

    //var keysSwitchState = ipcRenderer.sendSync('getKeysSwitchState');

    

    var midiDevices = ipcRenderer.sendSync('getMidiDevices');
    // Remove the message in dropdown if there are Midi Devices available
    if (Object.keys(midiDevices).length > 0) {
        $('#dropdownMidi').children("li").remove();

        if (ipcRenderer.sendSync('getIsMidiSelected') == true) {
            selectedMidi = ipcRenderer.sendSync('getMidiSelected')
            $("#midiDropdownButton").html(selectedMidi + ' <span class="caret"></span>');
            
            //$(this).parents(".dropdown").find('.btn').val($(this).data('value'));
        }
        
    }

    var midiDeviceKeys = Object.keys(midiDevices)
    // Add to the dropdown
    for (var key of midiDeviceKeys) {
        $('#dropdownMidi').append(
            "<li><a href='#' class='dropdown-item' data-value=" + midiDevices[key] + ">" + key + "</a></li>"
        );
    }

    // Check if an item in the dropdown was clicked
    $("#dropdownMidi li a").click(function(){
        $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
        $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
        ipcRenderer.send('openMidi', [$(this).data('value'), $(this).text()]);
    });

});

$('#keysSwitch').click(() => {
    var checkedValue = document.querySelector('#keysSwitch').checked;
    if (checkedValue == true) {
        ipcRenderer.send('inputTypeChange', true);
    } else if (checkedValue == false) {
        ipcRenderer.send('inputTypeChange', false);
    }
});

// Social Media
$("#github").click(function() {
    shell.openExternal("https://github.com/ejj28/mididrumhero");
});


