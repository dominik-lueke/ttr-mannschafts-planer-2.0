// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }

  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  var menu = Menu.buildFromTemplate([
    {
      label: 'Datei',
      submenu: [
        {
          label:'Neu',
          accelerator: 'CmdOrCtrl+N',
          click() { newFile() }
        },
        {type:'separator'},
        {
          label:'Öffnen',
          accelerator: 'CmdOrCtrl+O',
          click() { openFile() }
        },
        {type:'separator'},
        {
          label:'Speichern',
          accelerator: 'CmdOrCtrl+S',
          click() { saveFile() }
        },
        {
          label:'Speichern unter...',
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Alt+Command+S';
            else
              return 'Ctrl+Shift+S';
          })(),
          click() { saveFileAs() }
        },
        {type:'separator'},
        {
          label:'Schließen',
          click() { closeFile() }
        }
        ,{type:'separator'},
        {
          label:'Beenden',
          role: 'quit'
        }
      ]
    },
    {
      label: 'Ansicht',
      submenu: [
        {
          label: 'Neu laden',
          accelerator: 'CmdOrCtrl+R',
          role: 'reload'
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          role: 'toggleDevTools'
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu);

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

ipcMain.on('openFile', (event, args) => {
  openFile()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function newFile() {
  let response = mainWindow.webContents.send('newFile','Create a new File')
}

function closeFile() {
  let response = mainWindow.webContents.send('closeFile','Close the current File')
}

function saveFile() {
  let response = mainWindow.webContents.send('saveFile','Save the current File')
}

function saveFileAs() {
  let response = mainWindow.webContents.send('saveFileAs','Save the current File')
}

function openFile() {
  let response = mainWindow.webContents.send('openFile','Open a File')
}
