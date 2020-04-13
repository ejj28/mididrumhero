const {ipcRenderer} = require('electron');
const shell = require('electron').shell;


(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

// Initialize
$(document).ready(() => {

    // Check vJoy status
    var vJoyStatus = ipcRenderer.sendSync('getVjoyStatus');
    if (vJoyStatus == false) {
        alert("vJoy is either not installed or enabled, please fix this and then reopen MidiDrumHero")
    } 

    // Add drumpads to the table for the user to see
    var data = ipcRenderer.sendSync('getDrumPads');
    for (drumPad in data) {
        addToDrumPadTable(data[drumPad].velocity, data[drumPad].button, data[drumPad].midi);
    }

    var midiDevices = ipcRenderer.sendSync('getMidiDevices');
    // Remove the message in dropdown if there are Midi Devices available
    if (Object.keys(midiDevices).length > 0) {
        $('#dropdownMidi').children("li").remove();
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
        ipcRenderer.send('openMidi', $(this).data('value'));
    });

});

// Check if the save button in the new drumpad modal was clicked
$("#saveNewDrumPad").click(function() {
    var data =  $('#newDrumPadModalForm').serializeFormJSON();
    if (data.button <= 0 || data.button > 128) {
        alert("vJoy doesn't support buttons less than or equal to 0, and greater than 128!");
        $('#newDrumPadModalForm').trigger('reset');
    }
    else {
        ipcRenderer.send('saveDrumPad', data);
        addToDrumPadTable(data.velocity, data.button, data.midi);
        ipcRenderer.send('changedConfig');
    }
});

// Remove drumpad from table and from storage
function removeDrumPad(button) {
    ipcRenderer.send('removeDrumPad', $(button).parents("tr").index());
    $(button).parents("tr").remove();
    ipcRenderer.send('changedConfig');
}

// Add a drumpad to the UI table
function addToDrumPadTable(velocity, button, midi) {
    $('#drumPadTable tbody').append(
        "<tr>" +
            "<th scope='row'>" + midi + "</th>" +
            "<td>" + velocity + "</td>" +
            "<td>" + button + "</td>" +
            "<td><button type='button' class='btn btn-danger btn-sm' onclick='removeDrumPad(this)'>Remove</button></td>" +
        "</tr>"
    );
}

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


