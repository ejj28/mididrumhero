const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const storage = require('electron-json-storage');
const firstRun = require('electron-first-run');

function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  storage.setDataPath(storage.getDefaultDataPath());

  console.log(firstRun());

  if (firstRun() == true) {
    storage.set('config', [], (error => {
      if (error) throw error;
    }));
  }

  win.loadFile('src/index.html');

  //win.setMenu(null);
}

ipcMain.on('message', (event, arg) => {
  console.log(arg);
});

ipcMain.on('saveDrumPad', (event, arg) => {
  storage.get('config', (error, data) => {
    if (error) throw error;

    data.push(arg);
    
    storage.set('config', data, (err) => {
      if (err) throw err;
    });
  });
});

ipcMain.on('removeDrumPad', (event, arg) => {
  storage.get('config', (error, data) => {
    if (error) throw error;

    data.splice(arg, 1);
    
    storage.set('config', data, (err) => {
      if (err) throw err;
    });
  });
});

ipcMain.on('getDrumPads', (event, arg) => {
  storage.get('config', (error, data) => {
    if (error) throw error;

    event.returnValue = data;
  });
});

app.on('ready', createWindow);
