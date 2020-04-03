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

// Initalize
$(document).ready(() => {
    var data = ipcRenderer.sendSync('getDrumPads');
    for (drumPad in data) {
        addToDrumPadTable(data[drumPad].velocity, data[drumPad].button, data[drumPad].midi);
    }

    // Dropdown Selected Item
    var selected = ipcRenderer.sendSync('getMidiDevice');
    $("#dropdownMidi li a").parents(".dropdown").find('.btn').html(selected.deviceName + ' <span class="caret"></span>');
    $("#dropdownMidi li a").parents(".dropdown").find('.btn').val(selected.deviceVal);
});

function productDelete(ctl) {
    ipcRenderer.send('removeDrumPad', $(ctl).parents("tr").index());
    $(ctl).parents("tr").remove();
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

$("#saveNewDrumPad").click(function() {
    var data =  $('#newDrumPadModalForm').serializeFormJSON();
    ipcRenderer.send('saveDrumPad', data);
    $('#newDrumPadModalForm').trigger('reset');
    addToDrumPadTable(data.velocity, data.button, data.midi);
});

$("#dropdownMidi li a").click(function(){
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
    ipcRenderer.send('saveMidiDevice', [$(this).text(), $(this).data('value')]);
});

// Social Media
$("#github").click(function() {
    shell.openExternal("https://github.com/ejj28/mididrumhero");
});