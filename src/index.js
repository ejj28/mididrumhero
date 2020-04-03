const {ipcRenderer} = require('electron');
const storage = require('electron-json-storage');

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

$(document).ready(() => {
    var data = ipcRenderer.sendSync('getDrumPads');
    for (drumPad in data) {
        addToDrumPadTable(data[drumPad].velocity, data[drumPad].button, data[drumPad].midi);
    }
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