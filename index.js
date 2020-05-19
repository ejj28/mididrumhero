const { app, BrowserWindow, Tray, Menu } = require('electron');
const { ipcMain } = require('electron');
const storage = require('electron-json-storage');
const firstRun = require('electron-first-run');
const path = require('path');
const midi = require('midi');
const input = new midi.Input();
const { vJoy, vJoyDevice } = require('vjoy');
const fs = require('fs');

let device = vJoyDevice.create(1);
var midiConfig;

var advancedDebug = false;
var keysMode = false;
var isMidiSelected = false;
var selectedMidiPort = "";

var win;
var appIcon;

function createWindow () {
  win = new BrowserWindow({
    width: 900,
    height: 600,
    resizable: true,
    title: "MidiDrumHero",
    icon: path.join(__dirname, 'build/icon.png'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Dashboard', click: function () {
        win.show();
        win.loadFile('src/index.html');
      }
    },
    {
      label: 'Monitor', click: function () {
        win.show();
        win.loadFile('src/monitor.html');
      }
    },
    {type: 'separator'},
    {
      label: 'Quit', click: function () {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  storage.setDataPath(storage.getDefaultDataPath());

  if (firstRun() == true) {
    storage.set('config', {"midiConfig":[]}, (error => {
      if (error) throw error;
    }));
  }

  storage.has('config', (error, hasKey) => {
    if (error) throw error;

    if (hasKey) {
      console.log("Config created successfully!");
      midiConfig = getMidiConfig();
    }
    else {
      console.log("Config not created!");
      console.log("Creating config.");
      storage.set('config', {"midiConfig":[]}, (err => {
        if (err) throw err;
        midiConfig = getMidiConfig();
        console.log("Config created successfully!");
      }));
    }
  });

  win.loadFile('src/index.html');
  win.setMenu(null);

  win.on('close', function (event) {
    win = null;
  });

  win.on('minimize', function (event) {
    event.preventDefault();
    win.hide();

    appIcon = new Tray(path.join(__dirname, 'build/icon.png'));
    appIcon.setToolTip("MidiDrumHero");
    appIcon.setContextMenu(contextMenu);
  });

  win.on('show', function () {
    appIcon.destroy();
    appIcon = null;
  });
}

ipcMain.on('getVjoyStatus', (event, arg) => {
  // Alert the user if vJoy is not installed on the current computer
  if (!vJoy.isEnabled()) {
    event.returnValue = false
  } else {
    event.returnValue = true
  }
});

ipcMain.on('message', (event, arg) => {
  console.log(arg);
});

ipcMain.on('debugTypeChange', (event, arg) => {
  if (arg == true) {
    advancedDebug = true;
  } else if (arg == false) {
    advancedDebug = false;
  }
});

ipcMain.on('getDebugType', (event, arg) => {
  event.returnValue = advancedDebug;
});

ipcMain.on('inputTypeChange', (event, arg) => {
  if (arg == true) {
    keysMode = true;
  } else if (arg == false) {
    keysMode = false;
  }
});

ipcMain.on('getKeysSwitchState', (event, arg) => {
  event.returnValue = keysMode;
});

ipcMain.on('getIsMidiSelected', (event, arg) => {
  event.returnValue = isMidiSelected;
});

ipcMain.on('getMidiSelected', (event, arg) => {
  event.returnValue = selectedMidiPort;
});



ipcMain.on('saveDrumPad', (event, arg) => {
  storage.get('config', (error, data) => {
    if (error) throw error;
    data["midiConfig"].push(arg);
    
    storage.set('config', data, (err) => {
      if (err) throw err;
    });
  });
});

ipcMain.on('removeDrumPad', (event, arg) => {
  storage.get('config', (error, data) => {
    if (error) throw error;

    data["midiConfig"].splice(arg, 1);
    
    storage.set('config', data, (err) => {
      if (err) throw err;
    });
  });
});

ipcMain.on('getDrumPads', (event, arg) => {
  storage.get('config', (error, data) => {
    if (error) throw error;

    event.returnValue = data["midiConfig"];
  });
});

ipcMain.on('getMidiDevices', (event, arg) => {
  var devices = {}
  for (var i = 0; i < input.getPortCount(); i++) {
    devices[input.getPortName(i)] = i
  }
  event.returnValue = devices;
});

ipcMain.on('openMidi', (event, arg) => {
  input.closePort()
  input.openPort(arg[0])
  isMidiSelected = true;
  selectedMidiPort = arg[1]
});

function vJoySetButton(button, state) {
  device.buttons[button].set(state);
}

function getMidiConfig() {
  var path = storage.getDataPath()

  let rawdata = fs.readFileSync(path + "\\config.json");
  let parsed = JSON.parse(rawdata);
  return parsed["midiConfig"]
}

function setMidiConfig(){
  midiConfig = getMidiConfig();
}

ipcMain.on('changedConfig', (event, arg) => {
  setTimeout(setMidiConfig, 250);
});

input.on('message', (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  //console.log(`m: ${message} d: ${deltaTime}`);
  if (advancedDebug == true) {
    win.webContents.send('midiLog', "Status byte: " + message[0].toString(16) + ", Midi Note: " + message[1] + ", Velocity: " + message[2]);
  }
  
  if (keysMode == false) {
    if (message[0] >= 144 && message[0] <= 159 && message[2] != 0) {
      if (advancedDebug == false) {
        win.webContents.send('midiLog', "Midi Note: " + message[1] + ", Velocity: " + message[2]);
      }
      for (var entry of midiConfig) {
        if ((parseInt(entry["midi"]) == message[1]) && (parseInt(entry["velocity"]) <= message[2])) {
          vJoySetButton(parseInt(entry["button"]), true);
          setTimeout(vJoySetButton, 50, parseInt(entry["button"]), false);
          break;
        }
      }
    }
  } else if (keysMode == true) {
    if (message[0] >= 128 && message[0] <= 159) {
      if (advancedDebug == false) {
        win.webContents.send('midiLog', "Midi Note: " + message[1] + ", Velocity: " + message[2]);
      }
      for (var entry of midiConfig) {
        if (message[0] >= 144 && message[0] <= 159 && message[2] != 0) {
          if ((parseInt(entry["midi"]) == message[1]) && (parseInt(entry["velocity"]) <= message[2])) {
            vJoySetButton(parseInt(entry["button"]), true);
            break;
          }
        } else if ((message[0] >= 128 && message[0] <= 143) || (message[0] >= 144 && message[0] <= 159 && message[2] == 0)) {
          if (parseInt(entry["midi"]) == message[1]) {
            vJoySetButton(parseInt(entry["button"]), false);
            break;
          }
        }
      }
    }
  }
});

app.on('ready', createWindow);