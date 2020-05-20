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

    // Add drumpads to the table for the user to see
    console.log("yeet1");
    var data = ipcRenderer.sendSync('getDrumPads');
    console.log("yeet");
    for (drumPad in data) {
        addToDrumPadTable(data[drumPad].laneName, data[drumPad].midi, data[drumPad].velocity);
    }

    

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
        addToDrumPadTable(data.laneName, data.midi, data.velocity);
        ipcRenderer.send('changedConfig');
    }
});

// Remove drumpad from table and from storage
function removeDrumPad(button) {
    ipcRenderer.send('removeDrumPad', $(button).parents("tr").index());
    $(button).parents("tr").remove();
    ipcRenderer.send('changedConfig');
}

function editDrumPadMidi(button) {
    $('#editMidiNumberInput').attr("laneIndex", $(button).parents("tr").index());
    $('#editMidiNumberInput').val($(button).text()); 
    $('#editMidiModalHeader').text($(button).parents("tr").find("th").text());
    $('#editMidiModal').modal('show');
}

$("#saveMidiChanges").click(function() {
    data = [$('editMidiModal').attr("laneIndex"), $('#editMidiModal').val()];
    console.log(data);
    ipcRenderer.send('saveMidiData', data);
});

// Add a drumpad to the UI table
function addToDrumPadTable(name, midi, velocity) {
    $('#drumPadTable tbody').append(
        "<tr>" +
            "<th scope='row'>" + name + "</th>" +
            "<td><a onclick='editDrumPadMidi(this)' href='#'>" + midi + "</button></td>" +
            "<td><a onclick='editDrumPadVelocity(this)' href='#'>" + velocity + "</button></td>" +
            "<td><button type='button' class='btn btn-primary btn-sm' onclick='mapDrumPad(this)'>Map</button></td>" +
        "</tr>"
    );
}


// Social Media
$("#github").click(function() {
    shell.openExternal("https://github.com/ejj28/mididrumhero");
});


