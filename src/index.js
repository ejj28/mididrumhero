const {ipcRenderer} = require('electron');
const shell = require('electron').shell;
const midi = require('midi');
const input = new midi.Input();
const { vJoy, vJoyDevice } = require('vjoy');

let device = vJoyDevice.create(1);

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

// Initalize
$(document).ready(() => {
    var data = ipcRenderer.sendSync('getDrumPads');
    for (drumPad in data) {
        addToDrumPadTable(data[drumPad].velocity, data[drumPad].button, data[drumPad].midi);
    }

    if (!vJoy.isEnabled()) {
        alert("vJoy is either not installed or enabled, please fix this and then reopen MidiDrumHero")
    }

    // Dropdown Selected Item
    var selected = ipcRenderer.sendSync('getMidiDevice');
    $("#dropdownMidi li a").parents(".dropdown").find('.btn').html(selected.deviceName + ' <span class="caret"></span>');
    $("#dropdownMidi li a").parents(".dropdown").find('.btn').val(selected.deviceVal);

    for (var i = 0; i < input.getPortCount(); i++) {
        $('#dropdownMidi').append(
            "<li><a href='#' class='dropdown-item' data-value=" + i.toString() + ">" + input.getPortName(i) + "</a></li>"
        );
    }
});

$("#saveNewDrumPad").click(function() {
    var data =  $('#newDrumPadModalForm').serializeFormJSON();
    ipcRenderer.send('saveDrumPad', data);
    $('#newDrumPadModalForm').trigger('reset');
    addToDrumPadTable(data.velocity, data.button, data.midi);
});

$("#dropdownMidi li a").click(function(){
    input.closePort()
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
    ipcRenderer.send('saveMidiDevice', [$(this).text(), $(this).data('value')]);
    input.openPort($(this).data('value'));
});

function productDelete(button) {
    ipcRenderer.send('removeDrumPad', $(button).parents("tr").index());
    $(button).parents("tr").remove();
}

function addToDrumPadTable(velocity, button, midi) {
    $('#drumPadTable tbody').append(
        "<tr>" +
            "<th scope='row'>" + midi + "</th>" +
            "<td>" + velocity + "</td>" +
            "<td>" + button + "</td>" +
            "<td><button type='button' class='btn btn-danger' onclick='productDelete(this)'>Remove</button></td>" +
        "</tr>"
    );
}

// Social Media
$("#github").click(function() {
    shell.openExternal("https://github.com/ejj28/mididrumhero");
});

input.on('message', (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log(`m: ${message} d: ${deltaTime}`);
});
