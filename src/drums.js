const { ipcRenderer } = require('electron');
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
$("#saveNewDrumPad").click(function () {
    var data = $('#newDrumPadModalForm').serializeFormJSON();
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


var midiEditLaneIndex = 0;

var timerID = 0;
var countdownEnded = false;
var countdown = 5;
var mode = "single";

function runCountdown(mode) {
    if (countdown > 0) {
        countdown--;
        $(mapModalCountdown).text(countdown);
    } else {
        countdownEnded = true;
        clearInterval(timerID);
        endMapping(mode);
        cancelMapping();
        console.log("ENDMAPCALLEDBYRUNCNTDN");
    }

}

var mapLaneIndex = 0;
function mapAll() {
    mode = "multiple"

    var path = storage.getDataPath()

    let rawdata = fs.readFileSync(path + "\\config.json");

    let parsed = JSON.parse(rawdata)["drums"];

    for (var drum of parsed) {
        mapDrumPad(drum["button"], drum["midi"]);
    }
}

function mapDrumPad(index) {

}

function mapDrumPadSingle(button) {
    mapDrumPad($(button).parents("tr").index());


    $('#mapDrumPadModalHeader').text("Mapping " + $(button).parents("tr").find("th").text());
    countdown = 5;
    countdownEnded = false;
    $(mapModalCountdown).text(countdown);
    $('#mapDrumPadModal').modal('show');

    ipcRenderer.send('listenForMapping');
    timerID = setInterval(function () {
        runCountdown();
    }, 1000);
}

ipcRenderer.on('mappingHit', (event, args) => {
    clearInterval(timerID);
    $('#drumPadTable tbody tr:eq(' + mapLaneIndex + ') td:eq(0) a').text(args);
    var data = [mapLaneIndex, args];
    ipcRenderer.send('saveMidiData', data);
    endMapping();

});


function endMapping() {
    if (mode == "single") {
        console.log("ENDMAP");
        $('#mapDrumPadModal').modal('hide');
    } else {
        triggerNextMap();
    }
}

function cancelMapping() {
    ipcRenderer.send("cancelMapping");
}

function editDrumPadMidi(button) {
    midiEditLaneIndex = $(button).parents("tr").index();
    if ($(button).text() == "None") {
        $('#editMidiNumberInput').val("");
    } else {
        $('#editMidiNumberInput').val($(button).text());
    }

    $('#editMidiModalHeader').text($(button).parents("tr").find("th").text());
    $('#editMidiModal').modal('show');
}

$("#saveMidiChanges").click(function () {
    var data = [midiEditLaneIndex, $('#editMidiNumberInput').val()];
    console.log(data);
    ipcRenderer.send('saveMidiData', data);
    if (data[1] == "") {
        $('#drumPadTable tbody tr:eq(' + midiEditLaneIndex + ') td:eq(0) a').text("None");
    } else {
        $('#drumPadTable tbody tr:eq(' + midiEditLaneIndex + ') td:eq(0) a').text(data[1]);
    }

});


var velocityEditLaneIndex = 0;

function editDrumPadVelocity(button) {
    velocityEditLaneIndex = $(button).parents("tr").index();
    $('#editVelocityNumberInput').val($(button).text());
    $('#editVelocityModalHeader').text($(button).parents("tr").find("th").text());
    $('#editVelocityModal').modal('show');
}

$("#saveVelocityChanges").click(function () {

    var data
    var input = $('#editVelocityNumberInput').val()
    if (input == "") {
        $('#drumPadTable tbody tr:eq(' + velocityEditLaneIndex + ') td:eq(1) a').text("10");
        data = [velocityEditLaneIndex, "10"];
    } else {
        $('#drumPadTable tbody tr:eq(' + velocityEditLaneIndex + ') td:eq(1) a').text(input);
        data = [velocityEditLaneIndex, input];
    }
    console.log(data);
    ipcRenderer.send('saveVelocityData', data);

});

// Add a drumpad to the UI table

function addToDrumPadTable(name, midi, velocity) {
    if (midi == "") {
        $('#drumPadTable tbody').append(
            "<tr>" +
            "<th scope='row'>" +
            "<div class=\"btn-group\">" +
                "<button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"+ name + "</button>" +
                "<div class=\"dropdown-menu\">" +
                    "<a class=\"dropdown-item\" href=\"javascript:void(0)\">Red Snare</a>" +
                    "<a class=\"dropdown-item\" href=\"javascript:void(0)\">Yellow Tom</a>" +
                    "<a class=\"dropdown-item\" href=\"javascript:void(0)\">Blue Tom</a>" +
                    "<a class=\"dropdown-item\" href=\"javascript:void(0)\">Green Tom</a>" +
                "</div>" +
            "</div>" +
            "</th>" +
            "<td><a onclick='editDrumPadMidi(this)' href='#'>None</button></td>" +
            "<td><a onclick='editDrumPadVelocity(this)' href='#'>" + velocity + "</button></td>" +
            "<td><button type='button' class='btn btn-primary btn-sm' onclick='mapDrumPad(this, " + "\"single\"" + ")'>Map</button></td>" +
            "</tr>"
        );
    } else {
        $('#drumPadTable tbody').append(
            "<tr>" +
            "<th scope='row'>" + name + "</th>" +
            "<td><a onclick='editDrumPadMidi(this)' href='#'>" + midi + "</button></td>" +
            "<td><a onclick='editDrumPadVelocity(this)' href='#'>" + velocity + "</button></td>" +
            "<td><button type='button' class='btn btn-primary btn-sm' onclick='mapDrumPad(this, " + "\"single\"" + ")'>Map</button></td>" +
            "</tr>"
        );
    }
}


// Social Media
$("#github").click(function () {
    shell.openExternal("https://github.com/ejj28/mididrumhero");
});


