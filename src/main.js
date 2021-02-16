const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const path = require('path');

const isMac = process.platform === 'darwin'

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 950,
    minWidth: 900,
    minHeight: 950,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: true,
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'));

  win.webContents.openDevTools();

  win.webContents.once("did-frame-finish-load", function () {
    win.webContents.send('check-updates', {
      version: app.getVersion()
    });
  });

  var menu = Menu.buildFromTemplate([
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
  ]);

  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ],
    visible: false,
  }));

  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});
